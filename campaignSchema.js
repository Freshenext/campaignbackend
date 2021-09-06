const Joi = require('joi');

const campaignSchema = Joi.object({
    name : Joi.string().required(),
    category : Joi.string().required(),
    url : Joi.string().required()
});

module.exports = campaignSchema;