import Joi from "joi";

const registerLogisticValidation = Joi.object({
    logisticCode: Joi.string().max(191).required(),
    name: Joi.string().max(191).required(),
    service: Joi.string().max(191).required(),
});


export {
    registerLogisticValidation,
}