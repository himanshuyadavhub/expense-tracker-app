const {Users} = require("../models/associations");
const sendResponse = require("../utils/sendResponse");

async function getLeaderboard(req, res) {
    try {
        const allUsersExpensesSummary = await Users.findAll({
            attributes: [ "userName", "totalExpense"],
            order:[["totalExpense", "DESC"]]
        });
        
        sendResponse.ok(res, "Fetched Users and Expenses", allUsersExpensesSummary);

    } catch (error) {
        console.log("Error: getUsersExpensesSummary", error.message);
        return sendResponse.serverError(res, "Getting Leaderboard failed!")
    }
}

module.exports = {
    getLeaderboard,
}