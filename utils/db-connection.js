const Sequelize = require('sequelize');


const sequelize = new Sequelize("expensesapp","root","Server123", {host:"localhost",dialect:"mysql", logging:false});

async function checkDbConnection(sequelize){
    try {
        await sequelize.authenticate();
        console.log("DB connected succesfully!");
    } catch (error) {
        console.log("DB connection failed!",error.message);
    }
}

async function syncTables(sequelize) {
    try {
        await sequelize.sync({ alter: true });
        console.log("Tables synced succesfully!")
    } catch (error) {
        console.log("A problem with table sync", error.message);
    }
}


checkDbConnection(sequelize);
syncTables(sequelize);

module.exports = sequelize;