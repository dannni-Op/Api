import { registerLogisticValidation } from "../validation/logistic.validation.js"
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { validate } from "../validation/validation.js";

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
        data: validationResult,
    })

    return result;
}

export default {
    register,
}