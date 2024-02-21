import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { logIdValidation } from "../validation/logs.validation.js"
import { validate } from "../validation/validation.js"

const detail = async (userLogin, logId) => {
    const validationResult = validate(logIdValidation, { logId, });

    const log = await prismaClient.logs.findFirst({
        where: {
            logId,
        }
    });

    if(!log) throw new responseError(404, "Log tidak ditemukan!");

    return log;
}

const list = async (userLogin) => {
    const logs = await prismaClient.logs.findMany();
    if(logs.length < 1) throw new responseError(404, "List log kosong!");
    return logs;
}

export default {
    list,
    detail,
}