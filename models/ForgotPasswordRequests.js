const { DataTypes } = require('sequelize');


function createForgotPasswordRequestsSchema(sequelize, DataTypes) {
    const ForgotPasswordRequests =  sequelize.define('ForgotPasswordRequests', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    ForgotPasswordRequests.associate = (models) => {
        ForgotPasswordRequests.belongsTo(models.Users);
    };
    return ForgotPasswordRequests;
}

module.exports = createForgotPasswordRequestsSchema;