import Joi from "joi";

const registerStockValidation = Joi.object({
    sku: Joi.string().max(191).required(),
    code: Joi.string().max(191).required(),
    companyCode: Joi.string().max(191).required(),
    stock: Joi.number().positive().required(),
})

const updateStockValidation = Joi.object({
    stockId: Joi.string().max(191).required(),
    sku: Joi.string().max(191).optional(),
    code: Joi.string().max(191).optional(),
    companyCode: Joi.string().max(191).optional(),
    stock: Joi.number().positive().optional(),
})

const stockIdValidation = Joi.object({
    stockId: Joi.string().max(191).required(),
})

export {
    registerStockValidation,
    updateStockValidation,
    stockIdValidation,
}