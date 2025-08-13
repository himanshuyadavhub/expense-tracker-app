const { DataTypes } = require('sequelize');

function createDownloadsSchema(sequelize, DataTypes) {
    const Downloads = sequelize.define("Downloads", {
        id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },
      url:{
        type:DataTypes.STRING,
        allowNull:false
      }
    })

    Downloads.associate = (models) => {
        Downloads.belongsTo(models.Users);
    }
    return Downloads;
}

module.exports = createDownloadsSchema;