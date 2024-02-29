import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { idUserValidation } from "../validation/user.validation.js";
import { registerUserPermissionValidation, updateUserPermissionValidation } from "../validation/userPermissions.validation.js"
import { validate } from "../validation/validation.js"
import { createLog } from "./createLog.service.js";
import { getId } from "./genereateId.service.js";
import { getUTCTime } from "./time.service.js";

const register = async (userLogin, data, log = true) => {
    const validationResult = validate(registerUserPermissionValidation, data);

    const user = await prismaClient.users.findFirst({
        where: {
            userId: validationResult.userId,
        }
    })

    if(!user) throw new responseError(404, "User tidak ditemukan!");

    const isUserExist = await prismaClient.user_permissions.count({
        where: {
            userId: validationResult.userId,
        }
    });

    if(isUserExist === 1) throw new responseError(403, "User permission sudah ada!");

    const result = await prismaClient.user_permissions.create({
        data: {
            permissionId: getId(),
            userId: validationResult.userId,
            permissionType: validationResult.permissionType ? validationResult.permissionType : null,
            createdAt: getUTCTime(),
            updatedAt: getUTCTime(),
        }
    });

    if(log){
        const log = await createLog("create", "/api/user-permissions", JSON.stringify({
            ...data,
        }), 201, userLogin.userId);
    }
    
    return result;
}

const detail = async (userLogin, userId, log = true) => {
    const validationResult = validate(idUserValidation, { userId, });

    const isUserPermissionExist = await prismaClient.user_permissions.findFirst({
        where: {
            userId: validationResult.userId,
        }
    });

    if(!isUserPermissionExist) throw new responseError(404, "User permission tidak ditemukan!");

    if(log){
        const log = await createLog("read", "/api/user-permissions/"+userId, null, 200, userLogin.userId);
    }

    return isUserPermissionExist;
}

const list = async (userLogin, log = true) => {
    const result = await prismaClient.user_permissions.findMany();
    if(result.length < 1) throw new responseError(404, "User Permissions kosong!");
    if(log){
        const log = await createLog("read", "/api/user-permissions", null, 200, userLogin.userId);
    }
    return result;
}

const update = async (userLogin, data, log = true) => {
    const validationResult = validate(updateUserPermissionValidation, data);

    const userPermission = await prismaClient.user_permissions.findFirst({
        where: {
            userId: validationResult.userId,
        }
    })

    if(!userPermission) throw new responseError(404, "User permission tidak ditemukan!");
    
    const newData = {};
    if(validationResult.permissionType) newData.permissionType = validationResult.permissionType === "null" ? null : validationResult.permissionType;
    newData.updatedAt = getUTCTime();

    const result = await prismaClient.user_permissions.update({
        where: {
            permissionId: userPermission.permissionId,
        },
        data: newData,
    });

    if(log){
        const log = await createLog("update", "/api/user-permissions", JSON.stringify({
            ...data,
        }), 200, userLogin.userId);
    }

    return result;
}

export default {
    register,
    detail,
    list,
    update,
}