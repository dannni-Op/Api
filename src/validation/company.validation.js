import Joi from "joi";

const registerCompanyValidation = Joi.object({
    companyName: Joi.string().max(191).required(),
    companyCode: Joi.number().positive().required(),
});

export {
    registerCompanyValidation,
}