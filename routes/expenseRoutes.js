const express = require("express");
const router = express.Router();
const expenseController = require("../controller/expensesController");

router.post("/add", expenseController.addExpense);
router.get("/get", expenseController.getAllExpenses);
router.put("/update/:id", expenseController.updateExpense);
router.delete("/delete/:id", expenseController.deleteExpense);
module.exports = router;