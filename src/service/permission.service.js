//WIP (Work in Progress)
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";

const checkPermissionServerSide = async (data, action, target) => {
    const usersExist = await prismaClient.users.findFirst({
        where: {
            
            AND: [
                {
                    userId: data.userId,
                },
                {
                    userType: data.userType,
                }
            ]
            
        },
    });

    if(usersExist.userType !== "Admin" || usersExist.userType !== "Officer" || usersExist.userType !== "Financec"){
        throw new responseError(401, "Akses ditolak");
    }
    
    return true;
}

export {
    checkPermissionServerSide,
}