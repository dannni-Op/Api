import Joi from "joi";

const registerCompanyValidation = Joi.object({
    companyName: Joi.string().max(191).required(),
    companyCode: Joi.string().max(191).required(),
});

const updateCompanyValidation = Joi.object({
    companyName: Joi.string().max(191).optional(),
    companyCode: Joi.string().max(191).optional(),
})

const companyIdValidation = Joi.object({
    companyId: Joi.string().max(191).required()
})

export {
    registerCompanyValidation,
    updateCompanyValidation,
    companyIdValidation,
}