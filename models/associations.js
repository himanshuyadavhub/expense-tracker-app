const Users = require("./Users");
const Expenses = require("./Expenses");
const Payments = require("./Payments");
const ForgotPasswordRequests = require("./ForgotPasswordRequests");

Users.hasMany(Expenses);
Expenses.belongsTo(Users);

Users.hasMany(Payments);
Expenses.belongsTo(Users);

Users.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(Users);

module.exports = {
    Users,
    Expenses,
    Payments,
    ForgotPasswordRequests
};