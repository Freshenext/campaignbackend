const {Campaign, Client, ClientCampaignModel} = require('./../data');

const express = require('express');

const Router = express.Router();

Router.get('/:ClientId/:CampaignId', async (req,res) => {
    const { ClientId, CampaignId } = req.params;
    ClientCampaignModel.findAll({ where: { ClientId, CampaignId }})
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ error : 1});
        })
});
Router.post('/:ClientId/:CampaignId', async (req, res) => {
    const { ClientId, CampaignId } = req.params;
    const campaignOfClient = await ClientCampaignModel.findOne( { where : { ClientId, CampaignId }});
    if(campaignOfClient){
        // Exists, delete
        await ClientCampaignModel.destroy({ where : { ClientId , CampaignId}});
        return res.json({ campaignDeleted: 'success'});
    }
    ClientCampaignModel.create({
        ClientId,
        CampaignId,
    })
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.json({ error : 'Please verify the data and try again.'})
        })
})


module.exports = Router;