const config = require("../config");
const Sequelize = require('sequelize');


const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {host:config.db.host, dialect:"mysql", logging:false});

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