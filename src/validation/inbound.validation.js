import Joi from "joi";

const inboundValidation = Joi.object({
    warehouseId: Joi.string().max(191).required(),
    sku: Joi.string().max(191).required(),
    description: Joi.string().max(191).optional(),
    quantity: Joi.number().positive().required(),
});

const inboundIdValidation = Joi.object({
    inboundId: Joi.string().max(191).required(),
})

const updateInboundValidation = Joi.object({
    inboundId: Joi.string().max(191).required(),
    warehouseId: Joi.string().max(191).optional(),
    sku: Joi.string().max(191).optional(),
    description: Joi.string().max(191).optional(),
    quantity: Joi.number().positive().optional(),
    status: Joi.string().valid('pending','send','received','done','cancelled').optional(),
})

export {
    inboundValidation,
    inboundIdValidation,
    updateInboundValidation,
}