'use strict';
const {DataTypes} = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("DailyTotalExpenses",{
      id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },
      totalAmount:{
        type:DataTypes.INTEGER,
        defaultValue:0
      },
      UserId:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
          model:"Users",
          key:"id"
        },
        onDelete:"CASCADE"
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("DailyTotalExpenses");
  }
};
