import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { materialIdValidation, registerMaterialValidation, updateMaterialValidation } from "../validation/material.validation.js"
import { validate } from "../validation/validation.js"
import { createdBy } from "./created.service.js";
import { getId } from "./genereateId.service.js";
import { getUTCTime } from "./time.service.js";

const register = async (userLogin, data) => {
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
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        }
    });

    return result;
}

const list = async (userLogin) => {
    const result = await prismaClient.materials.findMany();
    if(result.length < 1) throw new responseError(404, "List material kosong!");
    return result;
}

const detail = async (userLogin, materialId) => {
    const validationResult = validate(materialIdValidation, { materialId, });

    const result = await prismaClient.materials.findFirst({
        where: {
            materialId: validationResult.materialId,
        }
    });

    if(!result) throw new responseError(404, "Material tidak ditemukan!");
    return result;
}

const deleteMaterial = async (userLogin, data) => {
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

    return {
        "message": "Delete success",
    }
}

const update = async (userLogin, data) => {
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
            updatedAt: getUTCTime(new Date().toISOString()),
        }
    })

    return result;
}

export default {
    register,
    list,
    detail,
    deleteMaterial,
    update,
}