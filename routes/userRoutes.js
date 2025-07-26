const express = require('express');
const router = express.Router();

const userController = require("../controller/userController");

router.get("/create", userController.renderSignupPage);
router.post("/create",userController.createUser);

router.get("/login",userController.renderLoginPage);
router.post("/login",userController.loginUser);

router.post("/forgotpassword", userController.sendResetPasswordLink);
router.get("/resetpassword/:requestId", userController.renderResetPasswordPage);
router.post("/updatepassword/:requestId", userController.resetPassword);

module.exports = router;