const express = require('express');
const {Campaign, CampaignCategoriesModel} = require("./../data");
const campaignSchema = require("./../data/schemas/campaignSchema");
const ImageHandler = require("./../classImageHandler");
const {Category, ClientCampaignModel} = require("../data");
const {sequelize} = require("../data/dbClass");
const { fetchCategories } = require('./categoryRoutes');
const Router = express.Router();

Router.get('/client/:ClientId', async (req,res) => {
    const { ClientId } = req.params;
    const result = await sequelize.query(`
    select ca.*, case when cca.id is null then 0 else 1 end as isClient from Campaigns ca
        left join ClientCampaigns cca on cca.CampaignId = ca.id and cca.ClientId = $ClientId
    group by ca.id
    `, { type : 'SELECT', bind : { ClientId }});
    res.json(result);
})

Router.get('/client/:ClientUrl/all', async (req,res) => {
    const { ClientUrl } = req.params;
    const campaignTransform = await sequelize.query(`
    select ca.*, case when cca.id is null then 0 else 1 end as isClient,
    (select group_concat(categoryName separator ',') from CampaignCategories
        where CampaignId = cca.CampaignId) as categories from Campaigns ca
        join ClientCampaigns cca on cca.CampaignId = ca.id
            join Clients cli on cli.id = cca.ClientId and cli.url = $ClientUrl
    group by ca.id
    `, { type : 'SELECT', bind : { ClientUrl }});

    const campaignsOfClient = campaignTransform.map(campaign => ({
        ...campaign,
        urlFull : `https://campaignapi.francis.center/images/${campaign.imagePath}`,
    }))
    const categories = await sequelize.query(`
    select cct.categoryName from CampaignCategories cct
        join Campaigns c on cct.CampaignId = c.id
            join ClientCampaigns c2 on c.id = c2.CampaignId
                join Clients c3 on c2.ClientId = c3.id and c3.url = $ClientUrl
    group by cct.categoryName
    `, { type : 'SELECT', bind : { ClientUrl }});
    res.json({ campaigns : campaignsOfClient, categories });
})

Router.get('/clientall', async (req,res) => {
    const campaigns = await sequelize.query(`
        select *, 
       (select GROUP_CONCAT(categoryName SEPARATOR ',') from CampaignCategories ctt where ctt.CampaignId = camp.id) as categories,
        concat('https://campaignapi.francis.center/images/', imagePath) as urlFull
        from Campaigns camp`, { type: 'SELECT'});

    const categories = await sequelize.query(`
    select cct.categoryName from CampaignCategories cct
        join Campaigns c on cct.CampaignId = c.id
    group by cct.categoryName
    `, { type : 'SELECT'});

    res.json({ campaigns, categories });
})

Router.get('/', async (req,res) => {
    const result = await Campaign.findAll({ include : CampaignCategoriesModel, });
    res.json(result.map(CampaignObj => ({
        ...CampaignObj.dataValues, urlFull : `https://campaignapi.francis.center/images/${CampaignObj.imagePath}`
    })));
});


Router.get('/:id', async (req,res) => {
    const { id } = req.params;
    const result = await Campaign.findByPk(id,  { include: CampaignCategoriesModel });
    if(result)
        res.json({...result.dataValues, urlFull : `https://campaignapi.francis.center/images/${result.imagePath}`});
    else
        res.json({});
});

Router.post('/', async(req,res) => {
    const categories = req.fields.category?.split(',');
    const { value : { name, category, url, isMobile, isDesktop}, error} = campaignSchema.validate({...req.fields, category : categories});

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

    for (const category of categories){
        await CampaignCategoriesModel.create({ categoryName : category, CampaignId : newCampaign.id  })
    }

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

    const categories = req.fields.category.split(',');
    const { value : { name, category, url, isMobile, isDesktop}, error} = campaignSchema.validate({ category : categories,
        name : req.fields.name,
        url : req.fields.url,
        isMobile : req.fields.isMobile,
        isDesktop : req.fields.isDesktop
    });

    const imageExists = Object.keys(req.files).length;

    if(imageExists > 1)
        return res.status(400).json( {error : "More than one image was sent. Only one is allowed."});

    if(error)
        return res.status(400).json({ error : error.details[0].message});

    /* First create campaign in DB */
    await CampaignCategoriesModel.destroy({ where : { CampaignId : req.params.id }});
    if(imageExists === 1){
        await ImageHandler.deleteImage(CampaignEdit.imagePath).catch(err => console.log(err));
        const image = req.files[Object.keys(req.files)[0]];

        const Image = await new ImageHandler(image.path);

        await CampaignEdit.update({ name, url, isMobile, isDesktop, imagePath : Image.uniqueIdentifier + '.jpeg'});

        for (const category of categories){
            await CampaignCategoriesModel.create({categoryName : category, CampaignId : req.params.id  })
        }
        //Move img to directory
        await Image.saveImageToFolder();
    } else {
        await CampaignEdit.update({ name, url,  isMobile, isDesktop});
        for (const category of categories){
            await CampaignCategoriesModel.create({ categoryName : category, CampaignId : req.params.id  })
        }
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