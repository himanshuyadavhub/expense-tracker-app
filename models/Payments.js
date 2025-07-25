const {DataTypes} = require('sequelize');
const sequelize = require("../utils/db-connection");

const Payment = sequelize.define("payment",{
    orderId:{
        type:DataTypes.STRING,
        primaryKey:true,
    },
    paymentStatus:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = Payment;