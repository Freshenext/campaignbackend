const express = require('express');
const Router = express.Router();
const {Client, ClientCampaignModel} = require('./../data');

Router.get('/', async (req,res) => {
    const results = await Client.findAll();
    if(results)
        return res.json(results);
    return [];
});

Router.get('/:id', async (req,res) => {
    const { id } = req.params;
    const result = await Client.findByPk(id);
    if(result){
        res.json(result);
    }
    return res.json({});

});

Router.post('/', async (req,res) => {
    Client.create(req.fields)
        .then((client) => {
            res.json(client);
        })
        .catch((error) => {
            res.status(400).json({ error: error.errors[0].message})
        });

});

Router.put('/:id', (req,res) => {
    const { id } = req.params;
    Client.update(req.fields, { where : { id }})
        .then(async (result) => {
            res.json(await Client.findByPk(id));
        })
        .catch((error) => {
            res.status(400).json({ error: error.errors[0].message})
        })
});

Router.delete('/:id', async (req,res) => {
    const { id } = req.params;
    Client.destroy({ where : { id }})
        .then(clientDestroyed => {
            console.log(clientDestroyed);
            res.json(clientDestroyed);
        })
        .catch(error => {
            console.log(error);
            res.json({ error : 1 });
        });
})

module.exports = Router;