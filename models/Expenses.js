const { DataTypes } = require('sequelize');

function createExpensesSchema(sequelize, DataTypes) {
    const Expenses = sequelize.define("Expenses", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    Expenses.associate = (models) => {
        Expenses.belongsTo(models.Users);
    };
    return Expenses;
}

module.exports = createExpensesSchema;