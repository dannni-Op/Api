import Joi from "joi";

const logIdValidation = Joi.object({
    logId: Joi.number().positive().required(),
});

export {
    logIdValidation,
}