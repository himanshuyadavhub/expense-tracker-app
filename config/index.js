require('dotenv').config();

const config = {
  port: process.env.E_PORT,
  host: process.env.HOST,
  email_api_key: process.env.EMAIL_API_KEY,
  cashfree_api_key: process.env.CASHFREE_API_KEY,
  cashfree_secret_key: process.env.CASHFREE_SECRET_KEY,
  jwt_key: process.env.JWT_KEY,
  IAM_ACCESS_KEY: process.env.IAM_ACCESS_KEY,
  IAM_SECRET_KEY: process.env.IAM_SECRET_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
  AWS_REGION: process.env.AWS_REGION,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT
}

module.exports = config;

// {
//   "development": {
//     "username": "root",
//     "password": "Server123",
//     "database": "expensesapp",
//     "host": "localhost",
//     "dialect": "mysql",
//     "logging":false
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }