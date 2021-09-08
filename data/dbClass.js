const { Sequelize, DataTypes, QueryTypes} = require('sequelize');

var db = 'campaigndb';
var username = 'root';
var pw = '';

if(process.env.NODE_ENV === "production"){
    db = 'frandev_campaign';
    username = 'frandev_campaign';
    pw = 'campaign123!@';
}

const sequelize = new Sequelize(db, username, pw, {
    host : 'localhost',
    port: 3306,
    dialect : "mysql"
});

const dbConnected = new Promise( async (resolve, reject) => {
    await sequelize.authenticate();
    console.log("CONNECTED");
    resolve(sequelize);
})


async function getDb(){
    await dbConnected;
    return sequelize;
}

module.exports = { sequelize, getDb, DataTypes, QueryTypes }