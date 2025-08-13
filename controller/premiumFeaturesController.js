const { sequelize, Users, Expenses, Payments, ForgotPasswordRequests, DailyTotalExpenses, Downloads } = require('../models');
const sendResponse = require("../utils/sendResponse");
const helperFunctions = require("../services/helperFunctions");
const s3Services = require("../services/s3Services");
const { Op } = require("sequelize");
const { raw } = require('mysql2');
const config = require("../config");
const BUCKET_NAME = config.BUCKET_NAME;
const AWS_REGION = config.AWS_REGION;

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
                attributes: ["amount", "description", "category", "createdAt"],
                raw: true
            })
        }

        if (duration === "monthly") {
            expenses = await DailyTotalExpenses.findAll({
                where: {
                    UserId: userId,
                    date: { [Op.between]: [startDate, endDate] }
                },
                attributes: ["totalAmount", "date"],
                raw: true
            })
        }
        if (!expenses.length) {
            return sendResponse.ok(res, `No expenses for ${duration} duration found!`, [])
        }
        const reportFileName = `report-${Date.now()}-${duration}-${userId}`;
        let reportFileUrl = "";
        const awsRes = await s3Services.uploadFileToS3(reportFileName, expenses);
        if (!awsRes) {
            throw new Error("Report file upload to S3 failed!");
        }
        reportFileUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${reportFileName}.csv`;
        const download = await Downloads.create({ url: reportFileUrl, UserId: userId });
        return sendResponse.ok(res, `${duration} expenses fetched`, [expenses, reportFileUrl]);

    } catch (error) {
        console.log("Error: getReportOfExpenses", error.message);
        return sendResponse.serverError(res, `Getting ${duration} report failed!`)
    }
}

async function getPreviousDownloads(req,res) {
    const userId = req.userId;
    try {
        const downloads = await Downloads.findAll({ where: { UserId: userId } });
        if(downloads.length > 0){
            return sendResponse.ok(res, "Fetched previous downloads!", downloads);
        }else{
            return sendResponse.ok(res, "No previous downloads found!", []);
        }
    } catch (error) {
        console.log("Error: getPreviousDownloads", error.message);
        return sendResponse.serverError(res, "Getting previous downloads failed!");
    }
}

module.exports = {
    getLeaderboard,
    getReportOfExpenses,
    getPreviousDownloads
}