import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(191).required(),
    password: Joi.string().max(191).required(),
    email: Joi.string().max(191).required(),
    fullName: Joi.string().max(191).required(),
    userType: Joi.string().valid('Owner', 'Admin','Officer','Finance','Customer_Admin','Customer_Service').required(),
    companyCode: Joi.string().max(191).optional(),
})

const loginUserValidation = Joi.object({
    username: Joi.string().max(191).required(),
    password: Joi.string().max(191).required(),
})
    
const getUsersValidation = Joi.object({})

const idUserValidation = Joi.object({
    userId: Joi.string().max(191).required()
})

const updateUserValidation = Joi.object({
    userId: Joi.string().max(191).required(),
    username: Joi.string().max(191).optional(),
    password: Joi.string().max(191).optional(),
    email: Joi.string().max(191).optional(),
    fullName: Joi.string().max(191).optional(),
    userType: Joi.string().valid('Owner', 'Admin','Officer','Finance','Customer_Admin','Customer_Service').optional(),
    companyCode: Joi.string().max(191).optional(),
})

export {
    registerUserValidation,
    loginUserValidation,
    getUsersValidation,
    updateUserValidation,
    idUserValidation,
}