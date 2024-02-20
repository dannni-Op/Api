import Joi from "joi";

const registerCompanyValidation = Joi.object({
    companyCode: Joi.string().max(191).required(),
    companyName: Joi.string().max(191).required(),
});

const updateCompanyValidation = Joi.object({
    companyId: Joi.string().max(191).required(),
    companyCode: Joi.string().max(191).optional(),
    companyName: Joi.string().max(191).optional(),
})

const companyIdValidation = Joi.object({
    companyId: Joi.string().max(191).required(),
})

export {
    registerCompanyValidation,
    updateCompanyValidation,
    companyIdValidation,
}