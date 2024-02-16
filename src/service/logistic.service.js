import { logisticCodeValidation, registerLogisticValidation, updateLogisticValidation } from "../validation/logistic.validation.js"
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { validate } from "../validation/validation.js";
import { getUTCTime } from "./time.service.js";

const register = async (userLogin, data) => {
    const validationResult = validate(registerLogisticValidation, data);

    const isLogisticExist = await prismaClient.logistics.count({
        where: {
            AND:[
                {
                    name: validationResult.name,
                },
                {
                    NOT: {
                        logisticCode: validationResult.logisticCode,
                    }
                }
            ],
        } 
    })

    if(isLogisticExist === 1 ) throw new responseError(403, "Logistic name sudah ada!");

    const result = await prismaClient.logistics.create({
        data: {
            ...validationResult,
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        }
    })

    return result;
}

const list = async (userLogin) => {
    const result = await prismaClient.logistics.findMany();
    if(result.length < 1) throw new responseError(404, "List Logistics kosong!");
    return result;
}

const detail = async (userLogin, logisticCode) => {
    const validationResult = validate(logisticCodeValidation, { logisticCode,} );

    const result = await prismaClient.logistics.findFirst({
        where: {
            logisticCode: validationResult.logisticCode,
        }
    });

    if(!result) throw new responseError(404, "Logistic tidak ditemukan!");

    return result;
}

const update = async (userLogin, data) => {
    const validationResult = validate(updateLogisticValidation, data);

    const isLogisticExist = await prismaClient.logistics.count({
        where: {
            logisticCode: validationResult.logisticCode,
        }
    })

    if(isLogisticExist === 0) throw new responseError(404, "Logistic tidak ditemukan!");

    const newData = {};
    if(validationResult.name) {
        const isNameExist = await prismaClient.logistics.count({
            where: {
                AND: [
                    {
                        name: validationResult.name,
                    },
                    {
                        NOT: {
                            logisticCode: validationResult.logisticCode,
                        }
                    }
                ]
            }
        })
        if(isNameExist === 1) throw new responseError(403, "Nama sudah terpakai!");
        newData.name = validationResult.name;
    }

    if(validationResult.service) newData.service = validationResult.service;
    newData.updatedAt = getUTCTime(new Date().toISOString());

    const result = await prismaClient.logistics.update({
        where: {
            logisticCode: validationResult.logisticCode,
        },
        data: {
            ...newData,
            updatedAt: getUTCTime(new Date().toISOString())
        }
    })

    return result;
}

const deleteLogistic = async (userLogin, data) => {
    const validationResult = validate(logisticCodeValidation, data );

    const check = await prismaClient.logistics.findFirst({
        where: {
            logisticCode: validationResult.logisticCode,
        }
    });

    if(!check) throw new responseError(404, "Logistic tidak ditemukan!");

    const result = await prismaClient.logistics.delete({
        where: {
            logisticCode: validationResult.logisticCode,
        }
    });

    return {
        message: "Delete Success",
    }

}

export default {
    register,
    list,
    detail,
    update,
    deleteLogistic,
}