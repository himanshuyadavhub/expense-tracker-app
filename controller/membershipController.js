const paymentServices = require("../services/paymentServices");
const sendResponse = require("../utils/sendResponse");
const { sequelize, Users, Expenses, Payments, ForgotPasswordRequests } = require('../models');
const path = require('path');



async function makePaymentForPremium(req, res) {
    const {orderId} = req.body;
    const customerId = req.userId;

    try {
        const uniqueOrderId= orderId+Date.now();
        const paymentSessionId = await paymentServices.createPaymentOrder(uniqueOrderId, String(customerId));
        const payment = await Payments.create({orderId:uniqueOrderId, userId:customerId, paymentStatus:"PENDING"})
        return sendResponse.ok(res, "Payment for premium initiated!", {paymentSessionId, orderId:uniqueOrderId});
    } catch (error) {
        console.log("Error: makePaymentForPremium", error.message);
        return sendResponse.serverError(res, "Payment initiation for failed!")
    }
}

async function updateStatusOfPremiumMembership(req, res) {
    const orderId = req.params.orderId;
    const userId = req.userId;
    try {

        const orderResponse = await paymentServices.getPaymentOrderResponse(orderId);
        let orderStatus;

        if (orderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {
            orderStatus = "Success"
        } else if (orderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
            orderStatus = "Pending"
        } else {
            orderStatus = "Failure"
        }

        await Payments.update({paymentStatus:orderStatus},{where:{orderId}});
        if(orderStatus === "Success"){
            await Users.update({isPremium:true}, {where: {id:userId}});
        }
        return sendResponse.ok(res,"Payment status updated!",{orderStatus});
    } catch (error) {
        return sendResponse.serverError(res,"Error: updateStatusOfPremiumMembership");
    }
}

module.exports = {
    makePaymentForPremium,
    updateStatusOfPremiumMembership
}