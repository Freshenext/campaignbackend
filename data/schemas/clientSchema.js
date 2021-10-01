const Joi = require('joi');

const clientSchema = Joi.object({
    name : Joi.string().required(),
    url : Joi.string().required(),
})

module.exports = clientSchema;