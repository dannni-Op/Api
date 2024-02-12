import Joi from "joi";

const registerProductValidation = Joi.object({
    sku: Joi.string().max(191).required(),
    name: Joi.string().max(191).required(),
    unit: Joi.number().positive().required(),
    warehouseCode: Joi.string().max(191).required(),
});

const updateProductValidation = Joi.object({
    sku: Joi.string().max(191).required(),
    name: Joi.string().max(191).optional(),
    unit: Joi.number().positive().optional(),
    warehouseCode: Joi.string().max(191).optional(),
});

const deleteProductValidation = Joi.object({
    sku: Joi.string().max(191).required(),
})

const detailProductValidation = Joi.object({
    sku: Joi.string().max(191).required(),
});

const listProductValidation = Joi.object({
    warehouseCode: Joi.string().max(191).required()
})

export {
    registerProductValidation,
    updateProductValidation,
    detailProductValidation,
    listProductValidation,
    deleteProductValidation,
}