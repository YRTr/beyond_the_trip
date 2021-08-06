const Joi = require('joi');

module.exports.tripSchema = Joi.object({
    trip: Joi.object({
        place: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})
