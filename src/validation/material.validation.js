import Joi from "joi";

const registerMaterialValidation = Joi.object({
    materialName: Joi.string().max(191).required(),
    unit: Joi.string().max(191).required(),
});

const materialIdValidation = Joi.object({
    materialId: Joi.string().max(191).required(),
});

const updateMaterialValidation = Joi.object({
    materialId: Joi.string().max(191).required(),
    materialName: Joi.string().max(191).optional(),
    unit: Joi.string().max(191).optional(),
})

export {
    registerMaterialValidation,
    materialIdValidation,
    updateMaterialValidation,
}