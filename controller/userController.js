const sendResponse = require("../utils/sendResponse");
const { Users, Expenses } = require("../models/associations");
const sequelize = require("../utils/db-connection");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

function renderLoginPage(req, res) {
    try {
        const pathName = path.join(__dirname, "../public/views/login.html");
        res.sendFile(pathName);
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
        const token = jwt.sign({ userId: user.id }, "JustASecretKey")
        return sendResponse.ok(res, "User logged In", { token, isPremiumUser: user.isPremium });
    } catch (error) {
        console.log("Error: loginUser", error.message);
        sendResponse.serverError(res, "Server Error: User login failed!")
    }
}

async function getUsersExpensesSummary(req, res) {
    try {
        const allUsersExpensesSummary = await Users.findAll({
            attributes: [ "userName", [sequelize.fn("SUM", sequelize.col("expenses.amount")), "totalAmount"]],
            include:[{
                model:Expenses,
                attributes:[]
            }],
            group: ["user.id"],
            order:[["totalAmount", "DESC"]]
        });
        
        sendResponse.ok(res, "Users and Expenses:", allUsersExpensesSummary);

    } catch (error) {
        console.log("Error: getUsersExpensesSummary", error.message);
        return sendResponse.serverError(res, "Getting Leaderboard failed!")
    }
}



module.exports = {
    renderLoginPage,
    createUser,
    loginUser,
    getUsersExpensesSummary
}