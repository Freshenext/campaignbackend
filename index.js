const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
var bodyparser = require('body-parser');
const formidable = require('express-formidable');
const fs = require('fs');
const { v4: uuidv4} = require('uuid');
const path = require('path');

app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended : true}));
app.use(formidable());

app.use("/images", express.static('images'));

const { sequelize, connectToDB : dbConnection, Campaign} = require('./campaignModel');
const campaignSchema = require('./campaignSchema');

app.get('/', async (req,res) => {
    res.json(await Campaign.findAll());
});

app.get('/:id', async (req,res) => {
    const { id } = req.params;
    res.json(await Campaign.findByPk(id));
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
    const uniqueIdentifier = uuidv4();
    const image = req.files[Object.keys(req.files)[0]];
    const imageExt = path.extname(image.name);
    const imagePath = `./images/${uniqueIdentifier}${imageExt}`
    const newCampaign = await Campaign.create({ name, category, url, imagePath : uniqueIdentifier + imageExt});
    /* Get the ID and save the image */

    // Move image to new directory
    await fs.writeFile(imagePath, await fs.readFileSync(image.path), (err)=>{
        if(err){
            return res.status(400).json({ error : err.message});
        }
    })


    res.json(newCampaign);
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
        const uniqueIdentifier = uuidv4();
        const image = req.files[Object.keys(req.files)[0]];
        const imageExt = path.extname(image.name);
        const imagePath = `./images/${uniqueIdentifier}${imageExt}`;
        await CampaignEdit.update({ name, category, imagePath : uniqueIdentifier + imageExt});
        //Move img to directory
        await fs.writeFile(imagePath, await fs.readFileSync(image.path), (err)=>{
            if(err){
                return res.status(400).json({ error : err.message});
            }
        })
    } else {
        await CampaignEdit.update({ name, category, url});
    }

    res.json({ 'message' : `Campaign ID updated`});
})

app.delete('/:id', async(req,res) => {
    const { id } = req.params;
    await Campaign.destroy({ where : {
        id : id
        }});
    res.json({ 'message' : `Campaign ID ${id} deleted successfully.`});
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})