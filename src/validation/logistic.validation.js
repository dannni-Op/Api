import Joi from "joi";

const registerLogisticValidation = Joi.object({
    logisticCode: Joi.string().max(191).required(),
    name: Joi.string().max(191).required(),
    service: Joi.string().max(191).required(),
});

const logictisCodeValidation = Joi.ValidationError.object({
    logisticCode: Joi.string().max(191).required(),
})

const updateLogisticValidation = Joi.object({
    logisticCode: Joi.string().max(191).required(),
    name: Joi.string().max(191).optional(),
    service: Joi.string().max(191).optional(),
});


export {
    registerLogisticValidation,
    logictisCodeValidation,
    updateLogisticValidation,
}