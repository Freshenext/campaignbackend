const { sequelize, DataTypes } = require('./dbClass');

const clientCampaign = sequelize.define('ClientCampaigns', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    }
});

module.exports = clientCampaign;