const express = require('express');
const axios = require('axios');

const Router = express.Router();

const authURL = `http://experience-api.sofiapulse.com/api/v1/auth/login`;
Router.post('/', async (req,res) => {
    const { username, password } = req.fields;
    if(username && password){
        axios.post(authURL, { username, password })
            .then(({data}) =>{
                res.json(data);
            })
            .catch(error => {
                let errorMessage = error.toString();
                if(error.response?.data?.message){
                    errorMessage += ': ' + error.response.data.message;
                }
                res.status(error.response?.status || 400).json({ error: errorMessage});
            })

    } else return res.json({ error: 'Please check your username and password attribute.'});
})

Router.get('/categoriesParameters', async (req,res) => {
    axios.get('http://experience-api.sofiapulse.com/api/v1/parameters', { headers : {
        'Authorization' : req.headers?.authorization ? req.headers.authorization : null
        }})
        .then(({ data }) => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error : 'There was an error processing this request.'});
        })
});

module.exports = Router;