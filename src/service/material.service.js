import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { materialIdValidation, registerMaterialValidation, updateMaterialValidation } from "../validation/material.validation.js"
import { validate } from "../validation/validation.js"
import { createLog } from "./createLog.service.js";
import { createdBy } from "./created.service.js";
import { getId } from "./genereateId.service.js";
import { getUTCTime } from "./time.service.js";

const register = async (userLogin, data, log = true) => {
    const validationResult = validate(registerMaterialValidation, data);

    console.log(validationResult);
    const isMaterialExist = await prismaClient.materials.findFirst({
        where: {
            materialName: validationResult.materialName,
        }
    });

    if(isMaterialExist) throw new responseError(403, "Material sudah ada!");

    const result = await prismaClient.materials.create({
        data: {
            materialId: getId(),
            ...validationResult,
            createdBy: await createdBy(userLogin.userId),
            createdAt: getUTCTime(),
            updatedAt: getUTCTime(),
        }
    });

    if(log){
        const log = await createLog("create", "/api/materials/register", JSON.stringify({
            ...data,
        }), 201, userLogin.userId);
    }
    
    return result;
}

const list = async (userLogin, log = true) => {
    const result = await prismaClient.materials.findMany();
    if(result.length < 1) throw new responseError(404, "List material kosong!");
    if(log){
        const log = await createLog("read", "/api/materials", null, 200, userLogin.userId);
    }
    return result;
}

const detail = async (userLogin, materialId, log = true) => {
    const validationResult = validate(materialIdValidation, { materialId, });

    const result = await prismaClient.materials.findFirst({
        where: {
            materialId: validationResult.materialId,
        }
    });

    if(!result) throw new responseError(404, "Material tidak ditemukan!");

    if(log){
        const log = await createLog("read", "/api/materials/"+materialId, null, 200, userLogin.userId);
    }
    
    return result;
}

const deleteMaterial = async (userLogin, data, log = true) => {
    const validationResult = validate(materialIdValidation, data);

    const isMaterialExist = await prismaClient.materials.findFirst({
        where: {
            materialId: validationResult.materialId,
        }
    });

    if(!isMaterialExist) throw new responseError(404, "Material tidak ditemukan!");

    const result = await prismaClient.materials.delete({
        where: {
            materialId: validationResult.materialId,
        }
    });

    if(log){
        const log = await createLog("delete", "/api/materials", JSON.stringify({
            ...data,
        }), 200, userLogin.userId);
    }

    return {
        "message": "Delete success",
    }
}

const update = async (userLogin, data, log = true) => {
    const validationResult = validate(updateMaterialValidation, data);

    const isMaterialExist = await prismaClient.materials.findFirst({
        where: {
            materialId: validationResult.materialId,
        }
    });

    if(!isMaterialExist) throw new responseError(404, "Material tidak ditemukan!");

    const newData = {};
    if(validationResult.materialName){
        const isMaterialExist = await prismaClient.materials.findFirst({
            where: {
                AND: [
                    {
                        materialName: validationResult.materialName,
                    },
                    {
                        NOT: {
                            materialId: validationResult.materialId,
                        }
                    }
                ]
            }
        }); 

        if(isMaterialExist) throw new responseError(403, "Material name sudah ada!");
        newData.materialName = validationResult.materialName;
    }

    if(validationResult.unit) newData.unit = validationResult.unit;

    const result  = await prismaClient.materials.update({
        where: {
            materialId: validationResult.materialId,
        },
        data: {
            ...newData,
            updatedAt: getUTCTime(),
        }
    })

    if(log){
        const log = await createLog("update", "/api/materials", JSON.stringify({
            ...data,
        }), 200, userLogin.userId);
    }
    
    return result;
}

export default {
    register,
    list,
    detail,
    deleteMaterial,
    update,
}