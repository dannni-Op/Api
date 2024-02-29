import Joi from "joi";

const shelfRegisterValidation = Joi.object({
    shelfCode: Joi.string().max(191).required(),
    maxCapacity: Joi.number().positive().required(),
})

const shelfIdValidation = Joi.object({
    shelfId: Joi.string().max(191).required(),
})

const shelfUpdateValidation = Joi.object({
    shelfId: Joi.string().max(191).required(),
    maxCapacity: Joi.number().positive().optional(),
})

export {
    shelfIdValidation,
    shelfRegisterValidation,
    shelfUpdateValidation,
}