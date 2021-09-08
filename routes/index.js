const campaignRoutes = require('./campaignsRoutes');
const categoryRoutes = require('./categoryRoutes');
function addRoutes(app){
    app.use('/campaigns', campaignRoutes);
    app.use('/category', categoryRoutes);
}

module.exports = addRoutes;