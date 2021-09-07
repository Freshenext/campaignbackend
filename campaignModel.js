const { Sequelize, DataTypes, QueryTypes} = require('sequelize');

var db = 'campaigndb';
var username = 'root';
var pw = '';

if(process.env.NODE_ENV === "production"){
    db = '';
    username = '';
    pw = '';
}
const sequelize = new Sequelize(db, username, pw, {
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

async function getCategories(){
    const db = await connectToDB();
    const categories = await db.query(`select name from campaigns group by category order by name`,
        { type: QueryTypes.SELECT});
    console.log(`AHOY`, categories);
    return categories;
}

module.exports = { sequelize, connectToDB, Campaign, getCategories }