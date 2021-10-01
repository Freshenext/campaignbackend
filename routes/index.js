const campaignRoutes = require('./campaignsRoutes');
const clientRoutes = require('./clientRoutes');
const clientCampaignRoutes = require('./clientCampaignsRoutes');
const categoryRoutes = require('./categoryRoutes');

function addRoutes(app){
    app.use('/campaigns', campaignRoutes);
    app.use('/category', categoryRoutes);
    app.use('/client', clientRoutes);
    app.use('/client', clientCampaignRoutes);
}

module.exports = addRoutes;