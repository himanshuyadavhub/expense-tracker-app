const { Cashfree, CFEnvironment } = require('cashfree-pg');

const CASHFREE_API_KEY = "TEST430329ae80e0f32e41a393d78b923034";
const CASHFREE_SECRET_KEY = "TESTaf195616268bd6202eeb3bf8dc458956e7192a85";

const cashfree = new Cashfree(CFEnvironment.SANDBOX, CASHFREE_API_KEY, CASHFREE_SECRET_KEY);

function createPaymentOrder(orderId, customerId) {

    const expiryDate = new Date(Date.now() + 16*60*1000);
    const formatedExpiryDate = expiryDate.toISOString()
    
    const request = {
        "order_amount": 1000,
        "order_currency": "INR",
        "order_id": orderId,
        "customer_details": {
            "customer_id": customerId,
            "customer_phone": "9999999999"
        },
        "order_meta": {
            "return_url": "http://localhost:5000/premium/status/"+ orderId
        },
        "order_expiry_time": formatedExpiryDate
    };

    return cashfree.PGCreateOrder(request).then((response) => {
        return response.data.payment_session_id;
    }).catch((error) => {
        console.error('Error: createPaymentOrder', error.response.data.message);
    });
}

function getPaymentOrderResponse(orderId) {    
    return cashfree.PGOrderFetchPayments(orderId).then((response) => {
        return response.data;
    }).catch((error) => {
        console.error('Error: getPaymentOrderResponse', error.response.data.message);
    });
}


module.exports = {
    createPaymentOrder,
    getPaymentOrderResponse
}