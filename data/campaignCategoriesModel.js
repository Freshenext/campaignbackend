const { sequelize, DataTypes } = require('./dbClass');

const CampaignCategories = sequelize.define('CampaignCategories', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    categoryName : {
        type : DataTypes.STRING,
        allowNull: false
    }
});

module.exports = CampaignCategories;