const Joi = require('joi');

const campaignSchema = Joi.object({
    name : Joi.string().required(),
    category : Joi.string().required(),
    url : Joi.string().uri().required()
});

module.exports = campaignSchema;