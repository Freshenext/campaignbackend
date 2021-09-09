const express = require('express');
const {Campaign} = require("./../data");
const campaignSchema = require("./../data/schemas/campaignSchema");
const ImageHandler = require("./../classImageHandler");

const Router = express.Router();


Router.get('/', async (req,res) => {
    const result = await Campaign.findAll();
    res.json(result.map(CampaignObj => ({
        ...CampaignObj.dataValues, urlFull : `https://campaignapi.francis.center/images/${CampaignObj.imagePath}`
    })));
});

Router.get('/:id', async (req,res) => {
    const { id } = req.params;
    const result = await Campaign.findByPk(id);
    if(result)
        res.json({...result.dataValues, urlFull : `https://campaignapi.francis.center/images/${result.imagePath}`});
    else
        res.json({});
});

Router.post('/', async(req,res) => {
    const { value : { name, category, url, isMobile, isDesktop}, error} = campaignSchema.validate(req.fields);
    const imageExists = Object.keys(req.files).length;
    if(imageExists <= 0)
        return res.status(400).json({ error : "An image must be sent in order to create a campaign."});

    if(imageExists > 1)
        return res.status(400).json( {error : "More than one image was sent. Only one is allowed."});

    if(error)
        return res.status(400).json({ error : error.details[0].message});

    /* First create campaign in DB */
    const image = req.files[Object.keys(req.files)[0]];
    const Image = await new ImageHandler(image.path);

    const newCampaign = await Campaign.create({ name, category, url, isMobile, isDesktop, imagePath : Image.uniqueIdentifier + '.jpeg'});
    /* Get the ID and save the image */

    // Move image to new directory

    await new Promise(async (resolve,reject) => {
        try {
            await Image.saveImageToFolder();
            resolve();
        } catch (err){
            reject(err);
        }
    }).then(() => {
        return res.json(newCampaign);

    }).catch(err => {
        return res.status(400).json({ error : err.message});
    });
})

Router.put('/:id', async(req,res)=>{
    const CampaignEdit = await Campaign.findByPk(req.params.id);
    if(!CampaignEdit){
        return res.status(400).json({ error : "Object not found"});
    }

    const { value : { name, category, url, isMobile, isDesktop}, error} = campaignSchema.validate(req.fields);

    const imageExists = Object.keys(req.files).length;

    if(imageExists > 1)
        return res.status(400).json( {error : "More than one image was sent. Only one is allowed."});

    if(error)
        return res.status(400).json({ error : error.details[0].message});

    /* First create campaign in DB */

    if(imageExists === 1){
        await ImageHandler.deleteImage(CampaignEdit.imagePath).catch(err => console.log(err));
        const image = req.files[Object.keys(req.files)[0]];

        const Image = await new ImageHandler(image.path);

        await CampaignEdit.update({ name, category, url, isMobile, isDesktop, imagePath : Image.uniqueIdentifier + '.jpeg'});
        //Move img to directory
        await Image.saveImageToFolder();
    } else {
        await CampaignEdit.update({ name, category, url,  isMobile, isDesktop});
    }

    res.json(CampaignEdit);
})

Router.delete('/:id', async(req,res) => {
    const { id } = req.params;
    await Campaign.destroy({ where : {
            id : id
        }});
    res.json({ 'message' : `Campaign ID ${id} deleted successfully.`});
})


module.exports = Router;