const {DataTypes} = require('sequelize');
const seqeuelize = require('../utils/db-connection');
const sequelize = require('../utils/db-connection');

const Expense = sequelize.define("expenses",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = Expense;