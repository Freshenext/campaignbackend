const campaignModel = require('./campaignModel');
const clientModel = require('./clientModel');
const campaignCategoriesModel = require('./campaignCategoriesModel');
const clientCampaignModel = require('./clientCampaignsModel');
const {sequelize} = require('./dbClass');


campaignCategoriesModel.belongsTo(campaignModel);
campaignModel.hasMany(campaignCategoriesModel);
campaignModel.belongsToMany(clientModel, { through: clientCampaignModel});

clientModel.belongsToMany(campaignModel, { through: clientCampaignModel});


//sequelize.sync({ force: true })//

module.exports = {
    Campaign : campaignModel,
    CampaignCategoriesModel : campaignCategoriesModel,
    Client : clientModel,
    ClientCampaignModel : clientCampaignModel
}
