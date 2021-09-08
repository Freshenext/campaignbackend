const { sequelize, getDb, DataTypes } = require('./dbClass');

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


//Campaign.sync({alter: true});

async function getCategories(){
    const db = await connectToDB();
    const categories = await db.query(`select category as name from Campaigns group by category order by name`,
        { type: QueryTypes.SELECT});
    console.log(`AHOY`, categories);
    return categories;
}

module.exports.Campaign = Campaign;