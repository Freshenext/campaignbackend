const express = require('express');

const Router = express.Router();
const {Category} = require("./../data");
const CategorySchema = require('./../data/schemas/categorySchema');

Router.get('/', async (req,res) => {
    res.json(await Category.findAll());
})

Router.get('/:id', async (req,res) => {
    const { id } = req.params;
    const result = await Category.findByPk(id);
    if(result)
        return res.json(result.dataValues)
    else return res.json({});
})

Router.post('/', async(req,res)=> {
    const {value, error} = CategorySchema.validate(req.fields);
    if(error)
        return res.status(400).json({ error : error.details[0].message});

    const newCategory = await Category.create({...value});
    return res.json(newCategory);
})


module.exports = Router;