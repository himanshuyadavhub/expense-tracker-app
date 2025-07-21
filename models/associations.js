const Users = require('./Users');
const Expenses = require("./Expenses");

Users.hasMany(Expenses);
Expenses.belongsTo(Users);

module.exports = {
    Users,
    Expenses
};