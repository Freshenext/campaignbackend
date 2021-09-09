const { sequelize, DataTypes } = require('./dbClass');

const Campaign = sequelize.define('Campaign', {
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    imagePath : {
        type : DataTypes.STRING,
        allowNull : false
    },
    url : {
        type : DataTypes.STRING,
        allowNull : false
    },
    isMobile : {
        type : DataTypes.BOOLEAN,
        allowNull : false,
        default: true
    },
    isDesktop : {
        type : DataTypes.BOOLEAN,
        allowNull: false,
        default : true
    }
})

module.exports = Campaign;