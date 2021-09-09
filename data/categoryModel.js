const { sequelize, DataTypes } = require('./dbClass');

const Category = sequelize.define('Category', {
    name : {
        type : DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Category;