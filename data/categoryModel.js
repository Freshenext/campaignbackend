const { sequelize, DataTypes } = require('./dbClass');


const Category = sequelize.define('Category', {
    name : {
        type : DataTypes.STRING,
        allowNull: false
    }
});

//Category.sync({alter: true});

module.exports.Category = Category;