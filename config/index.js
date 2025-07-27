require('dotenv').config();

const config = {
    port: process.env.E_PORT,
    email_api_key: process.env.EMAIL_API_KEY,
    cashfree_api_key: process.env.CASHFREE_API_KEY,
    cashfree_secret_key: process.env.CASHFREE_SECRET_KEY,
    jwt_key: process.env.JWT_KEY
}

module.exports = config;