const { DataTypes } = require('sequelize');

function createExpensesSchema(sequelize, DataTypes) {
    const DailyTotalExpenses = sequelize.define("DailyTotalExpenses", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        totalAmount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        
        date:{
            type:DataTypes.DATEONLY
        }
    })

    DailyTotalExpenses.associate = (models) => {
        DailyTotalExpenses.belongsTo(models.Users);
    }
    return DailyTotalExpenses;
}

module.exports = createExpensesSchema;