const {DataTypes} = require('sequelize');
const sequelize = require("../utils/db-connection");

const User = sequelize.define("user",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isPremium:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
    totalExpense:{
        type:DataTypes.INTEGER,
        defaultValue:0
    }
})

module.exports = User;