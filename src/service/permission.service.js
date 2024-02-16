//WIP (Work in Progress)
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";

const checkPermission = async (data, permission = null) => {
    const user = await prismaClient.users.findFirst({
        where: {

            AND: [
                {
                    userId: data.userId,
                },
                {
                    userType: data.userType,
                },
            ]
            
        },
        select: {
            userId:true,
            username: true,
            email: true,
            fullName: true,
            userType: true,
            userPermissions: true,
        }
    });

    if(!user) throw new responseError(404, "User tidak ditemukan!");

    if(
        (user.userPermissions.permissionType === permission ) || 
        (user.userPermissions[0].permissionType === null && user.userType === "Admin" || user.userType === "Officer" || user.userType === "Finance" || user.userType === "Owner")
    ) {
        return true;
    };
    return false;
}

export {
    checkPermission,
}