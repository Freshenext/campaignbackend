const campaignRoutes = require('./campaignsRoutes');
const clientRoutes = require('./clientRoutes');
const clientCampaignRoutes = require('./clientCampaignsRoutes');
const categoryRoutes = require('./categoryRoutes');
const authRoutes = require('./authRoutes');

function addRoutes(app){
    app.use('/campaigns', campaignRoutes);
    app.use('/category', categoryRoutes);
    app.use('/client', clientRoutes);
    app.use('/client', clientCampaignRoutes);
    app.use('/auth', authRoutes);
}

module.exports = addRoutes;