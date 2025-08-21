require('dotenv').config();

const config = {
    port: process.env.E_PORT,
    host:process.env.HOST,
    email_api_key: process.env.EMAIL_API_KEY,
    cashfree_api_key: process.env.CASHFREE_API_KEY,
    cashfree_secret_key: process.env.CASHFREE_SECRET_KEY,
    jwt_key: process.env.JWT_KEY,
    IAM_ACCESS_KEY: process.env.IAM_ACCESS_KEY,
    IAM_SECRET_KEY: process.env.IAM_SECRET_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
}

module.exports = config;