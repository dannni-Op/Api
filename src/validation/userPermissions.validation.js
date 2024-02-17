import Joi from "joi";

const registerUserPermissionValidation = Joi.object({
    userId: Joi.string().max(191).required(),
    permissionType: Joi.string().valid('Inbound','Outbound','Stock_Transfer','Order_Management').optional(),
});

const updateUserPermissionValidation = Joi.object({
    userId: Joi.string().max(191).required(),
    permissionType: Joi.string().valid('Inbound','Outbound','Stock_Transfer','Order_Management',"null").optional(),
})

export {
    registerUserPermissionValidation,
    updateUserPermissionValidation,
}