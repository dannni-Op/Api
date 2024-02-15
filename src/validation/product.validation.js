import Joi from "joi";

const registerProductValidation = Joi.object({
    sku: Joi.string().max(191).required(),
    name: Joi.string().max(191).required(),
    unit: Joi.string().max(191).required(),
    companyCode: Joi.string().max(191).required(),
});

const updateProductValidation = Joi.object({
    sku: Joi.string().max(191).required(),
    name: Joi.string().max(191).optional(),
    unit: Joi.string().max(191).optional(),
    companyCode: Joi.string().max(191).optional(),
});

const deleteProductValidation = Joi.object({
    sku: Joi.string().max(191).required(),
})

const detailProductValidation = Joi.object({
    sku: Joi.string().max(191).required(),
});

const listProductValidation = Joi.object({
    companyCode: Joi.string().max(191).optional(),
})

export {
    registerProductValidation,
    updateProductValidation,
    detailProductValidation,
    listProductValidation,
    deleteProductValidation,
}