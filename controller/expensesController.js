const Expense = require("../models/Expenses");
const sendResponse = require("../utils/sendResponse");

async function addExpense(req,res){
    try {
        const {amount,description,category} = req.body;
        const expense = await Expense.create({amount,description,category});
        return sendResponse.created(res,"Expenses added!",expense);
    } catch (error) {
        console.log("Error: addExpense",error.message);
        sendResponse.serverError(res,"Adding expense failed!")
    }
}

async function getAllExpenses(req,res){
    try {
        const expenses = await Expense.findAll();
        if(expenses.length > 0){
            return sendResponse.ok(res,"Fetched all expenses",expenses);
        }else{
            return sendResponse.ok(res,"No expenses found!",[])
        }
    } catch (error) {
        console.log("Error: getAllExpenses",error.message);
        sendResponse.serverError(res,"Getting expense failed!")
    }
}

module.exports = {
    addExpense,
    getAllExpenses
}