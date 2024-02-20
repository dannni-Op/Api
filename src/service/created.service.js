import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";

async function createdBy(userId){
    const user = await prismaClient.users.findFirst({
        where: {
            userId,
        }
    });

    if(!user) throw new responseError(404, "User tidak ada!");
    
    return userId;
}

export {
    createdBy,
}