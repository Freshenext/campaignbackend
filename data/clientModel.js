const { sequelize, DataTypes } = require('./dbClass');

const Client = sequelize.define('Client', {
    name : {
        type : DataTypes.STRING,
        allowNull : false,
        unique: true
    },
    url : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = Client;