import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { idUserValidation } from "../validation/user.validation.js";
import { registerUserPermissionValidation, updateUserPermissionValidation } from "../validation/userPermissions.validation.js"
import { validate } from "../validation/validation.js"
import { getId } from "./genereateId.service.js";
import { getUTCTime } from "./time.service.js";

const register = async (userLogin, data) => {
    const validationResult = validate(registerUserPermissionValidation, data);

    const isUserExist = await prismaClient.userPermissions.count({
        where: {
            userId: validationResult.userId,
        }
    });

    if(isUserExist === 1) throw new responseError(403, "User permission sudah ada!");

    const result = await prismaClient.userPermissions.create({
        data: {
            permissionId: getId(),
            userId: validationResult.userId,
            permissionType: validationResult.permissionType ? validationResult.permissionType : null,
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        }
    });

    return result;
}

const detail = async (userLogin, userId) => {
    const validationResult = validate(idUserValidation, { userId, });

    const isUserPermissionExist = await prismaClient.userPermissions.findFirst({
        where: {
            userId: validationResult.userId,
        }
    });

    if(!isUserPermissionExist) throw new responseError(404, "User permission tidak ditemukan!");

    return isUserPermissionExist;
}

const list = async (userLogin) => {
    const result = await prismaClient.userPermissions.findMany();
    if(result.length < 1) throw new responseError(404, "User Permissions kosong!");
    return result;
}

const update = async (userLogin, data) => {
    const validationResult = validate(updateUserPermissionValidation, data);

    const userPermission = await prismaClient.userPermissions.findFirst({
        where: {
            userId: validationResult.userId,
        }
    })

    if(!userPermission) throw new responseError(404, "User permission tidak ditemukan!");

    const newData = {};
    if(validationResult.permissionType) newData.permissionType = validationResult.permissionType === "null" ? null : validationResult.permissionType;
    newData.updatedAt = getUTCTime(new Date().toISOString());

    const result = await prismaClient.userPermissions.update({
        where: {
            permissionId: userPermission.permissionId,
        },
        data: newData,
    });

    return result;
}

export default {
    register,
    detail,
    list,
    update,
}