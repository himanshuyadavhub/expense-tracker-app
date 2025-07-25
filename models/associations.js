const Users = require("./Users");
const Expenses = require("./Expenses");
const Payments = require("./Payments");

Users.hasMany(Expenses);
Expenses.belongsTo(Users);

Users.hasMany(Payments);
Expenses.belongsTo(Users);

module.exports = {
    Users,
    Expenses,
    Payments
};