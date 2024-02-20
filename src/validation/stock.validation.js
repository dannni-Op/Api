import Joi from "joi";

const registerStockValidation = Joi.object({
    productId: Joi.string().max(191).required(),
    warehouseId: Joi.string().max(191).required(),
    stock: Joi.number().positive().required(),
})

const updateStockValidation = Joi.object({
    stockId: Joi.string().max(191).required(),
    productId: Joi.string().max(191).optional(),
    warehouseId: Joi.string().max(191).optional(),
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