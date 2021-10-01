const express = require('express');
const {sequelize} = require("../data/dbClass");

const Router = express.Router();

const fetchCategories = async () => {
    return sequelize.query(
        `select *, categoryName as name from CampaignCategories
             group by categoryName`, { type: 'SELECT'})
}

Router.get('/', async (req, res) => {
    const categories = await fetchCategories();
    res.json(categories);
});


// const {Category} = require("./../data");
// const CategorySchema = require('./../data/schemas/categorySchema');
//
// Router.get('/', async (req,res) => {
//     res.json(await Category.findAll());
// })
//
// Router.get('/:id', async (req,res) => {
//     const { id } = req.params;
//     const result = await Category.findByPk(id);
//     if(result)
//         return res.json(result.dataValues)
//     else return res.json({});
// })
//
// Router.post('/', async(req,res)=> {
//     const {value, error} = CategorySchema.validate(req.fields);
//     if(error)
//         return res.status(400).json({ error : error.details[0].message});
//
//     const newCategory = await Category.create({...value});
//     return res.json(newCategory);
// })
//
// Router.delete('/:id', async(req,res) => {
//     const {id} = req.params;
//     await Category.destroy({ where : { id }})
//     res.json({ 'message' : `Category ${id} deleted successfully.`})
// })
//
module.exports = Router;
module.exports.fetchCategories = fetchCategories;