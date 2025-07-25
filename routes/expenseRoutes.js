const express = require("express");
const router = express.Router();
const expenseController = require("../controller/expensesController");
const auth = require('../middleware/auth');


router.get("/", expenseController.renderExpensePage);
router.post("/add",auth.authenticateUser, expenseController.addExpense);
router.get("/get",auth.authenticateUser, expenseController.getAllExpenses);
router.put("/update/:id", auth.authenticateUser, expenseController.updateExpense);
router.delete("/delete/:id", auth.authenticateUser, expenseController.deleteExpense);

module.exports = router;