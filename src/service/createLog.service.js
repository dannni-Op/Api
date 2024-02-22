import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { getId } from "./genereateId.service.js";
import { getUTCTime } from "./time.service.js";

const createLog = async function(action, endpoint, params, status, userId){
    const result = await prismaClient.logs.create({
        data: {
            action,
            requestId: getId(),
            endpoint,
            params,
            status,
            userId,
            logDate: getUTCTime(),
        }
    });

    if(!result) throw new responseError(500, "Internal Server Error");
}

export {
    createLog,
}