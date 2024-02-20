import Joi from "joi";

const registerProductValidation = Joi.object({
    sku: Joi.string().max(191).required(),
    name: Joi.string().max(191).required(),
    unit: Joi.string().max(191).required(),
    companyId: Joi.string().max(191).required(),
});

const updateProductValidation = Joi.object({
    productId: Joi.string().max(191).required(),
    sku: Joi.string().max(191).optional(),
    name: Joi.string().max(191).optional(),
    unit: Joi.string().max(191).optional(),
    companyId: Joi.string().max(191).optional(),
});

const deleteProductValidation = Joi.object({
    productId: Joi.string().max(191).required(),
})

const detailProductValidation = Joi.object({
    productId: Joi.string().max(191).required(),
});

const listProductValidation = Joi.object({
    companyId: Joi.string().max(191).optional(),
})

export {
    registerProductValidation,
    updateProductValidation,
    detailProductValidation,
    listProductValidation,
    deleteProductValidation,
}