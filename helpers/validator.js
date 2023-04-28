const Joi = require('joi');

const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
})

const tweetValidator = Joi.object({
    tweet: Joi.string().max(160).required(),
})

const registerValidator = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    role: Joi.string(),
    confirmed: Joi.boolean()
})


module.exports =  { loginValidator, tweetValidator, registerValidator};