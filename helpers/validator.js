const Joi = require('joi');

const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
})

const productValidator = Joi.object({
    productName: Joi.string().min(5).required(),
    quantity: Joi.number().integer().required(),
    price: Joi.number().required(),
    avatar: Joi.string()
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


module.exports =  { loginValidator, productValidator, registerValidator };