import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(191).required(),
    password: Joi.string().max(191).required(),
    email: Joi.string().max(191).required(),
    fullName: Joi.string().max(191).required(),
    userType: Joi.string().valid('Admin','Officer','Finance','Customer_Admin','Customer_Service'),
    companyId: Joi.number(),
})

const loginUserValidation = Joi.object({
    username: Joi.string().max(191).required(),
    password: Joi.string().max(191).required(),
})
    
const getUsersValidation = Joi.object({
    fullName: Joi.string().max(191).required(),
    userType: Joi.string().valid('Admin','Officer','Finance','Customer_Admin','Customer_Service'),
})

export {
    registerUserValidation,
    loginUserValidation,
    getUsersValidation,
}