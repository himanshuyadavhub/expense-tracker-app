const Users = require("./Users");
const Expenses = require("./Expenses");
const Payments = require("./Payments");
const ForgotPasswordRequests = require("./ForgotPasswordRequests");

Users.hasMany(Expenses, {onDelete:"CASCADE"});
Expenses.belongsTo(Users);

Users.hasMany(Payments, {onDelete:"CASCADE"});
Expenses.belongsTo(Users);

Users.hasMany(ForgotPasswordRequests, {onDelete:"CASCADE"});
ForgotPasswordRequests.belongsTo(Users);

module.exports = {
    Users,
    Expenses,
    Payments,
    ForgotPasswordRequests
};