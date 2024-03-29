import Joi from "joi" ;

const registerWarehousevalidation = Joi.object({
    code: Joi.string().max(191).required(),
    name: Joi.string().max(191).required(),
    address: Joi.string().max(191).required(),
    status: Joi.string().valid("active","inactive").required(),
})


const updateWarehousevalidation = Joi.object({
    warehouseId: Joi.string().max(191).required(),
    code: Joi.string().max(191).optional(),
    name: Joi.string().max(191).optional(),
    address: Joi.string().max(191).optional(),
    status: Joi.string().valid("active","inactive").optional(),
})

const warehouseIdValidation = Joi.object({
    warehouseId: Joi.string().max(191).required(),
})

export {
    registerWarehousevalidation,
    updateWarehousevalidation,
    warehouseIdValidation,
}