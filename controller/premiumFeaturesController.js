const { sequelize, Users, Expenses, Payments, ForgotPasswordRequests, DailyTotalExpenses } = require('../models');
const sendResponse = require("../utils/sendResponse");
const helperFunctions = require("../services/helperFunctions");
const { Op } = require("sequelize")

async function getLeaderboard(req, res) {
    try {
        const allUsersExpensesSummary = await Users.findAll({
            attributes: ["userName", "totalExpense"],
            order: [["totalExpense", "DESC"]]
        });

        sendResponse.ok(res, "Fetched Users and Expenses", allUsersExpensesSummary);

    } catch (error) {
        console.log("Error: getLeaderboard", error.message);
        return sendResponse.serverError(res, "Getting Leaderboard failed!")
    }
}

async function getReportOfExpenses(req, res) {
    const userId = req.userId;
    const duration = req.query.duration;
    try {
        if (duration !== "weekly" && duration !== "monthly") {
            sendResponse.badRequest(res, "Duration can only be weekly or monthly!");
            return;
        }
        const [startDate, endDate] = helperFunctions.setDateInterval(duration);
        let expenses;
        if (duration === "weekly") {
            expenses = await Expenses.findAll({
                where: {
                    UserId: userId,
                    createdAt: { [Op.between]: [startDate, endDate] }
                },
                attributes: { exclude: ["UserId"] }
            })
        }

        if (duration === "monthly") {
            expenses = await DailyTotalExpenses.findAll({
                where: {
                    UserId: userId,
                    date: { [Op.between]: [startDate, endDate] }
                },
                attributes: { exclude: ["UserId"] }
            })
        }

        if (!expenses.length) {
            return sendResponse.ok(res, "No expenses for selected duration found!", [])
        }
        return sendResponse.ok(res, `${duration} expenses fetched`, expenses);

    } catch (error) {
        console.log("Error: getReportOfExpenses", error.message);
        return sendResponse.serverError(res, `Getting ${duration} report failed!`)
    }
}

module.exports = {
    getLeaderboard,
    getReportOfExpenses
}