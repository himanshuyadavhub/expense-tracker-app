const { DataTypes } = require('sequelize');


function defineUserSchema(sequelize, DataTypes) {
    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isPremium: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        totalExpense: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    })

    Users.associate = (models) => {
        Users.hasMany(models.Expenses, { onDelete: "CASCADE" });
        Users.hasMany(models.Payments, { onDelete: "CASCADE" });
        Users.hasMany(models.ForgotPasswordRequests, { onDelete: "CASCADE" });
    }

    return Users;
}


module.exports = defineUserSchema;