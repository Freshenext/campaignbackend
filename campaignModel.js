const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('campaigndb', 'root', '', {
    host : 'localhost',
    port: 3306,
    dialect : "mysql"
});

const Campaign = sequelize.define('Campaign', {
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    category : {
        type : DataTypes.STRING,
        allowNull: false
    },
    imagePath : {
        type : DataTypes.STRING,
        allowNull : false
    },
    url : {
        type : DataTypes.STRING,
        allowNull : false
    }
})


//Campaign.sync({force: true});

const dbConnected = new Promise( async (resolve, reject) => {
    await sequelize.authenticate();
    console.log("CONNECTED");
    resolve(sequelize);
})


async function connectToDB(){
    await dbConnected;
    return sequelize;
}

module.exports = { sequelize, connectToDB, Campaign }