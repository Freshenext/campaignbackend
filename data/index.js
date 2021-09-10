const categoryModel = require('./categoryModel');
const campaignModel = require('./campaignModel');
const campaignCategoriesModel = require('./campaignCategoriesModel');
const {sequelize} = require('./dbClass');

categoryModel.belongsToMany(campaignModel, { through : campaignCategoriesModel});
campaignModel.belongsToMany(categoryModel, { through : campaignCategoriesModel});

module.exports = {
    Category : categoryModel,
    Campaign : campaignModel,
    CampaignCategoriesModel : campaignCategoriesModel
}
