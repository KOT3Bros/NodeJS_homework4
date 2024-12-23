const joi = require('joi');

const userSchema = joi.object({
    surname: joi.string().min(1).required(),
    name: joi.string().min(1).required(),
    patronymic: joi.string().min(1).required(),
    age: joi.number().min(0).max(120).required(),
    city: joi.string().min(3)
});

const idSchema = joi.object({
    id: joi.number().required()
});

module.exports = { userSchema, idSchema };