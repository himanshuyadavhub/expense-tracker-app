const { Expenses, Users } = require("../models/associations");
const sequelize = require("../utils/db-connection");
const sendResponse = require("../utils/sendResponse");
const path = require('path');


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
    try {
        const userId = req.userId;
        const { amount, description, category } = req.body;

        const expense = await Expenses.create({ amount, description, category, userId }, {transaction});

        const user = await Users.findByPk(userId, {transaction});
        user.totalExpense= Number(user.totalExpense) + Number(amount);
        await user.save({transaction});

        await transaction.commit();
        return sendResponse.created(res, "Expenses added!", expense);
    } catch (error) {
        await transaction.rollback();
        console.log("Error: addExpense", error.message);
        return sendResponse.serverError(res, "Adding expense failed!")
    }
}

async function getAllExpenses(req, res) {
    try {
        const userId = req.userId;
        const expenses = await Expenses.findAll({ where: { userId } });
        if (expenses.length > 0) {
            return sendResponse.ok(res, "Fetched all expenses", expenses);
        } else {
            return sendResponse.ok(res, "No expenses found!", [])
        }
    } catch (error) {
        console.log("Error: getAllExpenses", error.message);
        return sendResponse.serverError(res, "Getting expense failed!")
    }
}

async function updateExpense(req, res) {
    const transaction = await sequelize.transaction();

    try {
        const id = req.params.id;
        const userId = req.userId;
        const { amount, description, category } = req.body;

        const expense = await Expenses.findOne({ where: { id, userId } }, {transaction});

        if (!expense) {
            await transaction.rollback();
            return sendResponse.notFound(res, `Expense with id ${id} not found!`);
        }
        const user = await Users.findByPk(userId, {transaction});
        user.totalExpense= Number(user.totalExpense) + Number(amount) - Number(expense.amount);
        await user.save({transaction});

        expense.amount = amount;
        expense.description = description;
        expense.category = category;
        await expense.save({transaction});

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
        const expense = await Expenses.findOne({where:{id,userId}}, {transaction});
        if(!expense){
            await transaction.rollback();
            return sendResponse.notFound(res, `Expense with id ${id} not found!`);
        }

        const user = await Users.findByPk(userId, {transaction});
        user.totalExpense= Number(user.totalExpense) - Number(expense.amount);
        await user.save({transaction});

        await expense.destroy({ where: { id, userId } }, {transaction});
        
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
    getAllExpenses,
    updateExpense,
    deleteExpense,
}