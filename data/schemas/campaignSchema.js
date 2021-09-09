const Joi = require('joi');

const campaignSchema = Joi.object({
    name : Joi.string().required(),
    category : Joi.array().required(),
    url : Joi.string().uri().required(),
    isMobile : Joi.boolean().required(),
    isDesktop : Joi.boolean().required()
});

module.exports = campaignSchema;