const categoryModel = require('./categoryModel');
const campaignModel = require('./campaignModel');
const campaignCategoriesModel = require('./campaignCategoriesModel');
const {sequelize} = require('./dbClass');

categoryModel.belongsToMany(campaignModel, { through : campaignCategoriesModel});
sequelize.sync({ force: true});///

module.exports = {
    Category : categoryModel,
    Campaign : campaignModel
}
