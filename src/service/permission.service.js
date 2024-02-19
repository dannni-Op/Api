//WIP (Work in Progress)

import { prismaClient } from "../app/db.js"
import { responseError } from "../error/response.error.js";

const checkPermission = async (userLogin, action, target) => {
    
    let userSide;
    //check user ada atau tidak
    const user = await prismaClient.users.findFirst({
        where: {
            userId: userLogin.userId,
        }
    });

    if(!user) throw new responseError(401, "User tidak ada!");

    
    //check ada permission atau tidak
    const userPermissions = await prismaClient.userPermissions.findFirst({
        where: {
            userId: userLogin.userId,
        }
    });
    
    if(!userPermissions) throw new responseError(401, "User tidak punya permission!");
    
    userSide = user.companyCode ? "clientSide" : "backOffice";
}

export {
    checkPermission,
}