import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(191).required(),
    password: Joi.string().max(191).required(),
    email: Joi.string().max(191).required(),
    fullName: Joi.string().max(191).required(),
    userType: Joi.string().valid('Admin','Officer','Finance','Customer Admin','Customer Service').required(),
    companyId: Joi.number().optional(),
    userPermission: Joi.string().valid('Inbound','Outbound','Stock Transfer','Order Management').optional(),
})

const loginUserValidation = Joi.object({
    username: Joi.string().max(191).required(),
    password: Joi.string().max(191).required(),
})
    
const getUsersValidation = Joi.object({})

const updateUserValidation = Joi.object({
    username: Joi.string().max(191).optional(),
    password: Joi.string().max(191).optional(),
    email: Joi.string().max(191).optional(),
    fullName: Joi.string().max(191).optional(),
    userType: Joi.string().valid('Admin','Officer','Finance','Customer Admin','Customer Service').optional(),
    companyId: Joi.number().optional(),
})

export {
    registerUserValidation,
    loginUserValidation,
    getUsersValidation,
    updateUserValidation,
}