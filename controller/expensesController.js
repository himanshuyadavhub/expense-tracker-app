const { sequelize, Users, Expenses, Payments, ForgotPasswordRequests, DailyTotalExpenses } = require('../models');
const sendResponse = require("../utils/sendResponse");
const path = require('path');
const ITEMS_PER_PAGE = 4;


function renderExpensePage(req, res) {
    try {
        const pathName = path.join(__dirname, "../public/views/expenses.html");
        res.sendFile(pathName);
    } catch (error) {
        console.log("Error: renderExpensePage", error.message);
        return sendResponse.notFound(res, "Getting expenses failed!")
    }
}

async function addExpense(req, res) {
    const transaction = await sequelize.transaction();
    const todayDate = new Date().toISOString().split('T')[0];
    try {
        const UserId = req.userId;
        const { amount, description, category } = req.body;

        const expense = await Expenses.create({ amount, description, category, UserId }, { transaction });

        const user = await Users.findByPk(UserId, { transaction });
        user.totalExpense = Number(user.totalExpense) + Number(amount);
        await user.save({ transaction });

        const dailyTotalExpense = await DailyTotalExpenses.findOne({ where: { UserId, date: todayDate } }, { transaction });
        if (dailyTotalExpense) {
            dailyTotalExpense.totalAmount = Number(dailyTotalExpense.totalAmount) + Number(amount);
            await dailyTotalExpense.save({ transaction });
        } else {
            await DailyTotalExpenses.create({ totalAmount: amount, UserId, date: todayDate }, { transaction });
        }

        await transaction.commit();
        return sendResponse.created(res, "Expenses added!");
    } catch (error) {
        await transaction.rollback();
        console.log("Error: addExpense", error.message);
        return sendResponse.serverError(res, "Adding expense failed!")
    }
}

async function getPerPageExpenses(req, res) {
    try {
        const UserId = req.userId;
        const page = req.query.page || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        const expenses = await Expenses.findAll({ offset, limit, order: [["createdAt", "DESC"]], where: { UserId }, attributes: { exclude: ["UserId"] } });
        if (expenses.length > 0) {
            return sendResponse.ok(res, "Fetched all expenses", expenses);
        } else {
            return sendResponse.ok(res, "No expenses found!", [])
        }
    } catch (error) {
        console.log("Error: getPerPageExpenses", error.message);
        return sendResponse.serverError(res, "Getting expense failed!")
    }
}

async function getTotalCountOfExpenses(req, res) {
    const userId = req.userId;
    try {
        const totalCount = await Expenses.count({ where: { UserId: userId } });
        sendResponse.ok(res, "Fetched total count of expenses!", { totalCount, ITEMS_PER_PAGE });
    } catch (error) {
        console.log("Error: getTotalCountOfExpenses", error.message);
        return sendResponse.serverError(res, "Fetching total count failed!");
    }
}



async function updateExpense(req, res) {
    const transaction = await sequelize.transaction();

    try {
        const id = req.params.id;
        const userId = req.userId;
        const { amount, description, category } = req.body;

        const expense = await Expenses.findOne({ where: { id, UserId: userId }, attributes: { exclude: ["UserId"] }}, { transaction });

        if (!expense) {
            await transaction.rollback();
            return sendResponse.notFound(res, `Expense with id ${id} not found!`);
        }
        const user = await Users.findByPk(userId, { transaction });
        user.totalExpense = Number(user.totalExpense) + Number(amount) - Number(expense.amount);
        await user.save({ transaction });

        const expenseDate = expense.createdAt.toISOString().split('T')[0];
        const dailyTotalExpense = await DailyTotalExpenses.findOne({ where: { UserId: userId, date: expenseDate } }, { transaction });
        dailyTotalExpense.totalAmount = Number(dailyTotalExpense.totalAmount) + Number(amount) - Number(expense.amount);
        await dailyTotalExpense.save({ transaction });

        expense.amount = amount;
        expense.description = description;
        expense.category = category;
        await expense.save({ transaction });

        await transaction.commit();

        return sendResponse.ok(res, "Expense updated!", expense);

    } catch (error) {
        await transaction.rollback();
        console.log("Error: updateExpense", error.message);
        return sendResponse.serverError(res, "Updating expense failed!")
    }
}

async function deleteExpense(req, res) {
    const transaction = await sequelize.transaction();

    try {
        const userId = req.userId;
        const id = req.params.id;
        const expense = await Expenses.findOne({ where: { id, UserId: userId } }, { transaction });
        if (!expense) {
            await transaction.rollback();
            return sendResponse.notFound(res, `Expense with id ${id} not found!`);
        }
        const expenseDate = expense.createdAt.toISOString().split('T')[0];
        const dailyTotalExpense = await DailyTotalExpenses.findOne({ where: { UserId: userId, date: expenseDate } }, { transaction });
        dailyTotalExpense.totalAmount = Number(dailyTotalExpense.totalAmount) - Number(expense.amount);
        await dailyTotalExpense.save({transaction});

        const user = await Users.findByPk(userId, { transaction });
        user.totalExpense = Number(user.totalExpense) - Number(expense.amount);
        await user.save({ transaction });

        await expense.destroy({ where: { id, UserId: userId } }, { transaction });

        await transaction.commit();
        return sendResponse.ok(res, `Expense with id ${id} deleted successfully!`);
    } catch (error) {
        await transaction.rollback();
        console.log("Error: deleteExpense", error.message);
        return sendResponse.serverError(res, "Deleting expense failed!")
    }
}



module.exports = {
    renderExpensePage,
    addExpense,
    getPerPageExpenses,
    getTotalCountOfExpenses,
    updateExpense,
    deleteExpense,
}