const {DataTypes} = require('sequelize');
const sequelize = require("../utils/db-connection");

const ForgotPasswordRequest= sequelize.define('forgotPasswordRequest',{
    id:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
});

module.exports = ForgotPasswordRequest;