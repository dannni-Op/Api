import Joi from "joi";

const registerCompanyValidation = Joi.object({
    companyName: Joi.string().max(191).required(),
    companyCode: Joi.number().positive().required(),
});

const updateCompanyValidation = Joi.object({
    companyName: Joi.string().max(191).optional(),
    companyCode: Joi.number().positive().optional(),
})

const companyIdValidation = Joi.object({
    companyId: Joi.number().positive().required()
})

export {
    registerCompanyValidation,
    updateCompanyValidation,
    companyIdValidation,
}