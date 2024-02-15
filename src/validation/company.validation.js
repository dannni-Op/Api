import Joi from "joi";

const registerCompanyValidation = Joi.object({
    companyCode: Joi.string().max(191).required(),
    companyName: Joi.string().max(191).required(),
});

const updateCompanyValidation = Joi.object({
    companyCode: Joi.string().max(191).required(),
    companyName: Joi.string().max(191).optional(),
})

const companyCodeValidation = Joi.object({
    companyCode: Joi.string().max(191).required(),
})

export {
    registerCompanyValidation,
    updateCompanyValidation,
    companyCodeValidation,
}