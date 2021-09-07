const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
var bodyparser = require('body-parser');
const formidable = require('express-formidable');
const fs = require('fs');
const { v4: uuidv4} = require('uuid');
const path = require('path');
var accessLogStream = fs.createWriteStream('./api.log', { flags: 'a' })
const morgan = require('morgan');
const sharp = require('sharp');
const ImageHandler = require('./classImageHandler');

app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended : true}));
app.use(formidable());
app.use(morgan('combined',{ stream : accessLogStream}));

app.use("/images", express.static('images'));

const { sequelize, connectToDB : dbConnection, Campaign, getCategories} = require('./campaignModel');
const campaignSchema = require('./campaignSchema');
const {log} = require("sharp/lib/libvips");

app.get('/', async (req,res) => {
    const result = await Campaign.findAll();
    res.json(result.map(CampaignObj => ({
        ...CampaignObj.dataValues, urlFull : `https://campaignapi.francis.center/images/${CampaignObj.imagePath}`
    })));
});

app.get('/:id', async (req,res) => {
    const { id } = req.params;
    const result = await Campaign.findByPk(id);
    if(result)
        res.json({...result.dataValues, urlFull : `https://campaignapi.francis.center/images/${result.imagePath}`});
    else
        res.json({});
});

app.post('/', async(req,res) => {
    const { value : { name, category, url}, error} = campaignSchema.validate(req.fields);
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

    const newCampaign = await Campaign.create({ name, category, url, imagePath : Image.uniqueIdentifier + '.jpeg'});
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

app.put('/:id', async(req,res)=>{
    const CampaignEdit = await Campaign.findByPk(req.params.id);
    if(!CampaignEdit){
        return res.status(400).json({ error : "Object not found"});
    }

    const { value : { name, category, url}, error} = campaignSchema.validate(req.fields);

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

        await CampaignEdit.update({ name, category, imagePath : Image.uniqueIdentifier + '.jpeg'});
        //Move img to directory
        await Image.saveImageToFolder();
    } else {
        await CampaignEdit.update({ name, category, url});
    }

    res.json(CampaignEdit);
})

app.delete('/:id', async(req,res) => {
    const { id } = req.params;
    await Campaign.destroy({ where : {
        id : id
        }});
    res.json({ 'message' : `Campaign ID ${id} deleted successfully.`});
})

app.get('/category/list', async (req,res) => {
    res.json(await getCategories());
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})