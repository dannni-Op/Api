import { logisticIdValidation, registerLogisticValidation, updateLogisticValidation } from "../validation/logistic.validation.js"
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { validate } from "../validation/validation.js";
import { getUTCTime } from "./time.service.js";
import { getId } from "./genereateId.service.js";
import { createdBy } from "./created.service.js";
import { createLog } from "./createLog.service.js";

const register = async (userLogin, data, log = true) => {
    const validationResult = validate(registerLogisticValidation, data);

    const isLogisticExist = await prismaClient.logistics.count({
        where: {
            logisticCode: validationResult.logisticCode,
        } 
    })

    if(isLogisticExist === 1 ) throw new responseError(403, "Logistic code sudah ada!");

    const checkName = await prismaClient.logistics.count({
        where: {
            name: validationResult.name,
        }
    })

    if(checkName === 1 ) throw new responseError(403, "Logistic name sudah ada!");

    const result = await prismaClient.logistics.create({
        data: {
            logisticId: getId(),
            ...validationResult,
            createdBy: await createdBy(userLogin.userId),
            createdAt: getUTCTime(),
            updatedAt: getUTCTime(),
        }
    })

    if(log){
        const log = await createLog("create", "/api/logistics/register", JSON.stringify({
            ...data,
        }), 200, userLogin.userId);
    }

    return result;
}

const list = async (userLogin, log = true) => {
    const result = await prismaClient.logistics.findMany();
    if(result.length < 1) throw new responseError(404, "List  logistics kosong!");

    if(log){
        const log = await createLog("read", "/api/logistics", null, 200, userLogin.userId);
    }
    return result;
}

const detail = async (userLogin, logisticId, log = true ) => {
    const validationResult = validate(logisticIdValidation, { logisticId,} );

    const result = await prismaClient.logistics.findFirst({
        where: {
            logisticId: validationResult.logisticId,
        }
    });

    if(!result) throw new responseError(404, "Logistic tidak ditemukan!");

    if(log){
        const log = await createLog("read", "/api/logistics/"+logisticId, null, 200, userLogin.userId);
    }

    return result;
}

const update = async (userLogin, data, log = true) => {
    const validationResult = validate(updateLogisticValidation, data);

    const isLogisticExist = await prismaClient.logistics.count({
        where: {
            logisticId: validationResult.logisticId,
        }
    })

    if(isLogisticExist === 0) throw new responseError(404, "Logistic tidak ditemukan!");

    const newData = {};

    if(validationResult.logisticCode) {
        const result = await prismaClient.logistics.count({
            where: {
                AND: [
                    {
                        logisticCode: validationResult.logisticCode,
                    },
                    {
                        NOT: {
                            logisticId: validationResult.logisticId,
                        }
                    }
                ]
            }
        })
        if(result === 1) throw new responseError(403, "Logistic code sudah ada!");
        newData.logisticCode = validationResult.logisticCode;
    }
    
    if(validationResult.name) {
        const isNameExist = await prismaClient.logistics.count({
            where: {
                AND: [
                    {
                        name: validationResult.name,
                    },
                    {
                        NOT: {
                            logisticId: validationResult.logisticId,
                        }
                    }
                ]
            }
        })
        if(isNameExist === 1) throw new responseError(403, "Logistic name sudah ada!");
        newData.name = validationResult.name;
    }

    if(validationResult.service) newData.service = validationResult.service;
    newData.updatedAt = getUTCTime();

    const result = await prismaClient.logistics.update({
        where: {
            logisticId: validationResult.logisticId,
        },
        data: {
            ...newData,
            updatedAt: getUTCTime()
        }
    })

    if(log){
        const log = await createLog("update", "/api/logistics", JSON.stringify({
            ...data,
        }), 200, userLogin.userId);
    }

    return result;
}

const deleteLogistic = async (userLogin, data, log = true) => {
    const validationResult = validate(logisticIdValidation, data );

    const check = await prismaClient.logistics.findFirst({
        where: {
            logisticId: validationResult.logisticId,
        }
    });

    if(!check) throw new responseError(404, "Logistic tidak ditemukan!");

    const result = await prismaClient.logistics.delete({
        where: {
            logisticId: validationResult.logisticId,
        }
    });

    if(log){
        const log = await createLog("delete", "/api/logistics", JSON.stringify({
            ...data,
        }), 200, userLogin.userId);
    }

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