const sendResponse = require("../utils/sendResponse");
const { Users, Expenses, ForgotPasswordRequests } = require("../models/associations");
const sequelize = require("../utils/db-connection");
const config = require("../config");

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const emailServices = require("../services/emailServices");
const User = require("../models/Users");

function renderSignupPage(req, res) {
    try {
        const pathName = path.join(__dirname, "../public/views/signup.html");
        return res.sendFile(pathName);
    } catch (error) {
        console.log("Error: renderSignupPage", error.message);
        return sendResponse.notFound(res, "Getting signup page failed");
    }
}

function renderLoginPage(req, res) {
    try {
        const pathName = path.join(__dirname, "../public/views/login.html");
        return res.sendFile(pathName);
    } catch (error) {
        console.log("Error: renderLoginPage", error.message);
        return sendResponse.notFound(res, "Getting login page failed!")
    }
}
async function createUser(req, res) {
    try {
        const { userName, email, password } = req.body;
        let user = await Users.findOne({ where: { email } });
        if (user) {
            return sendResponse.badRequest(res, "Email Id already used")
        }
        const hash = await bcrypt.hash(password, 10);
        user = {
            userName,
            email,
            password: hash,
            isPremium: false
        }

        const createdUser = await Users.create(user);
        return sendResponse.created(res, "User created!", createdUser);

    } catch (error) {
        console.log("Error: createUser", error.message);
        sendResponse.serverError(res, "Server Error: User signup failed!")
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return sendResponse.notFound(res, "Email not registered!")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse.notAuthorized(res, "Incorrect password!");
        }
        const token = jwt.sign({ userId: user.id }, config.jwt_key)
        return sendResponse.ok(res, "User logged In", { token, isPremiumUser: user.isPremium });
    } catch (error) {
        console.log("Error: loginUser", error.message);
        sendResponse.serverError(res, "Server Error: User login failed!")
    }
}

async function sendResetPasswordLink(req, res) {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return sendResponse.notFound(res, "Email id not registered");
        }
        const requestId = uuid.v4();
        const passwordRequest = await ForgotPasswordRequests.create({ id: requestId, userId: user.id, isActive: true });

        const resetLink = `http://localhost:5000/user/resetpassword/${requestId}`;

        const result = await emailServices.sendResetLink("kunal.singh.temp@gmail.com", user.userName, resetLink);
        if(!result){
            throw new Error("Reset password link was not sent!")
        }
        sendResponse.ok(res, "Reset password link sent!", result);
    } catch (error) {
        console.error("Error: sendResetPasswordLink:", error.message);
        sendResponse.serverError(res, "Reset link was not send");
    }
}

async function renderResetPasswordPage(req, res) {
    const requestId = req.params.requestId;
    try {
        const passwordRequest = await ForgotPasswordRequests.findByPk(requestId);
        if (!passwordRequest) {
            sendResponse.badRequest(res, "Password reset Link does not exists!");
            return
        }
        if (!passwordRequest.isActive) {
            sendResponse.badRequest(res, "Password reset Link has been expired!")
            return
        }
        const pathName = path.join(__dirname, "../public/views/forgotpassword.html");
        return res.sendFile(pathName);
    } catch (error) {
        console.log("Error: renderResetPasswordPage", error.message);
    }
}

async function resetPassword(req, res) {
    const { password } = req.body;
    const requestId = req.params.requestId;
    const transaction = await sequelize.transaction()

    try {
        const passwordRequest = await ForgotPasswordRequests.findByPk(requestId, {transaction});
        if (!passwordRequest || !passwordRequest.isActive) {
            await transaction.rollback();
            sendResponse.badRequest(res, "Link does not exists or no longer active!")
            return
        };
        const userId = passwordRequest.userId;
        const user = await Users.findByPk(userId, {transaction});
        if(!user){
            await transaction.rollback();
            sendResponse.badRequest(res, "User not registered");
            return;
        };
        const hash = await bcrypt.hash(password, 10);
        user.password = hash;
        await user.save({transaction});
        passwordRequest.isActive = false;
        await passwordRequest.save({transaction});
        await transaction.commit();
        sendResponse.ok(res, "Password Updated!");
    } catch (error) {
        await transaction.rollback();
        console.log("Error: resetPassword", error.message);
        return sendResponse.serverError(res, "Password updation failed " + error.message);
    }
}





module.exports = {
    renderSignupPage,
    renderLoginPage,
    createUser,
    loginUser,
    sendResetPasswordLink,
    renderResetPasswordPage,
    resetPassword
}