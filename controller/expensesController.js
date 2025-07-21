const { Expenses } = require("../models/associations");
const sendResponse = require("../utils/sendResponse");

async function addExpense(req, res) {
    try {
        const userId = req.userId;
        const { amount, description, category } = req.body;
        const expense = await Expenses.create({ amount, description, category, userId });
        return sendResponse.created(res, "Expenses added!", expense);
    } catch (error) {
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
    try {
        const id = req.params.id;
        const userId = req.userId;
        const { amount, description, category } = req.body;
        const [updatedCount] = await Expenses.update({ amount, description, category }, { where: { id, userId } });
        if (updatedCount === 0) {
            return sendResponse.notFound(res, `Expense with id ${id} not found!`);
        }
        const expense = await Expenses.findOne({where:{id, userId}});
        return sendResponse.ok(res, "Expense updated!", expense);

    } catch (error) {
        console.log("Error: updateExpense", error.message);
        return sendResponse.serverError(res, "Updating expense failed!")
    }
}

async function deleteExpense(req, res) {
    try {
        const userId = req.userId;
        const id = req.params.id;
        const deletedExpenseCount = await Expenses.destroy({ where: { id, userId } });
        if (deletedExpenseCount === 0) {
            return sendResponse.notFound(res, `Expense with id ${id} not found!`)
        }
        return sendResponse.ok(res, `Expense with id ${id} deleted successfully!`);
    } catch (error) {
        console.log("Error: deleteExpense", error.message);
        return sendResponse.serverError(res, "Deleting expense failed!")
    }
}

module.exports = {
    addExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
}