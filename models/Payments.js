const { DataTypes } = require('sequelize');


function createPaymentsSchema(sequelize, DataTypes) {
    const Payments = sequelize.define("Payments", {
        orderId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        paymentStatus: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return Payments;
}


module.exports = createPaymentsSchema;