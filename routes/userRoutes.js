const express = require('express');
const router = express.Router();

const userController = require("../controller/userController");

router.get("/login",userController.renderLoginPage);
router.post("/create",userController.createUser);
router.post("/login",userController.loginUser);

router.get("/leaderboard",userController.getUsersExpensesSummary);

module.exports = router;