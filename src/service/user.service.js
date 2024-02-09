import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { checkPermission } from "./permission.service.js";
import { getUTCTime } from "./time.service.js";
import { permissionType, roleName } from "@prisma/client";

const register = async (data) => {
    const user = validate(registerUserValidation, data);
    const countUser = await prismaClient.users.count({
        where:{
            username: user.username,
        }
    });

    if(countUser === 1) throw new responseError(400,"Username sudah ada!");

    const countUserEmail = await prismaClient.users.count({
        where:{
            email: user.email,
        }
    });

    if(countUserEmail === 1) throw new responseError(400,"Email sudah ada!");

    user.password = await bcrypt.hash(user.password, 10);
    const result = await prismaClient.users.create({
        data: {
            username: user.username,
            password: user.password,
            email: user.email,
            fullName: user.fullName,
            userType: user.userType,
            companyId: user.companyId,
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        },
        select:{
            userId: true,
            username: true,
            email: true,
            fullName: true,
            userType: true,
            companyId: true,
            createdAt: true,
        }
    });
    
    let resultRole = await prismaClient.roles.findFirst({
        where: {
            roleName: user.roleName,
        }
    })
    
    
    if(!resultRole){
        resultRole = await prismaClient.roles.create({
            data: {
                roleName: user.roleName,
                createdAt: getUTCTime(new Date().toISOString()),
                updatedAt: getUTCTime(new Date().toISOString()),
            }
        })
    }

    const userRole = await prismaClient.userRoles.create({
        data: {
            userId: result.userId,
            roleId: resultRole.roleId,
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        }
    })

    const resultPermission = await prismaClient.userPermissions.create({
        data: {
            userId: result.userId,
            permissionType: user.permissionType,
        }
    });

    return {
        ...result,
        permissionType: resultPermission.permissionType,
        roleName: resultRole.roleName,
    };
}

const login = async (data) => {
    const resultValidation = validate(loginUserValidation, data);
    
    const user = await prismaClient.users.findFirst({
        where: {
            username: resultValidation.username,
        },
        select: {
            userId: true,
            username: true,
            email: true,
            fullName: true,
            userType: true,
            password: true,
            companyId: true,
            createdAt: true,
            userPermissions: true,
            userRoles: true,
        }
    });
    if(!user) throw new responseError(401, "Username atau Password salah");
    const isPasswordTrue = await bcrypt.compare(data.password, user.password);
    if(!isPasswordTrue) throw new responseError(401, "Password salah!");

    const roles = await prismaClient.roles.findFirst({
        where: {
            roleId: user.userRoles[0].roleId,
        }
    })

    const token = jwt.sign({
        userId: user.userId,
        username:user.username,
        password: user.password,
        email:user.email,
        fullName:user.fullName,
        userType:user.userType,
        permissionType: user.userPermissions[0].permissionType,
        roleName: roles.roleName,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: "3h",
    })

    return {
        data:{
            userId: user.userId,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            userType: user.userType,
            companyId: user.companyId,
            permissionType: user.userPermissions[0].permissionType,
            roleName: roles.roleName,
            createdAt: user.createdAt,
        },
        token,
    };

}

const list = async (userLogin) => {

    const users = await prismaClient.users.findMany({
        select: {
            userId: true,
            username: true,
            email: true,
            fullName: true,
            userType: true,
            companyId: true,
            createdAt: true,
            updatedAt: true,
        }
        });

    if(users.length < 1) throw new responseError(404, "Users Kosong!");

    return users;
}

const update = async (userLogin, data, userIdTarget) => {
    // const resultPermission = await checkPermission(userLogin);
    // if(!resultPermission) throw new responseError(401, "Akses ditolak");
    const user = validate(updateUserValidation, data);

    const countUser = await prismaClient.users.count({
        where:{
            userId: userIdTarget,
        }
    });

    if(countUser !== 1) throw new responseError(404, "User tidak ditemukan!");

    const newData = {};
    if(user.username) {
        const result = await prismaClient.users.count({
            where: {
                AND: [
                    { 
                        username: user.username
                    },
                    {
                        NOT: {
                            userId: userIdTarget,
                        }
                    }
                ],
            },
        });

        if(result === 1) throw new responseError(400, "Username sudah ada!");

        newData.username = user.username; 
    }
    if(user.password) newData.password = await bcrypt.hash(user.password, 10); 
    if(user.email) {
        const result = await prismaClient.users.count({
            where: {
                AND: [
                    { 
                        email: user.email
                    },
                    {
                        NOT: {
                            userId: userIdTarget,
                        }
                    }
                ],
            },
        });

        if(result === 1) throw new responseError(400, "Email sudah ada!");

        newData.email = user.email
    }; 
    if(user.fullName) newData.fullName = user.fullName; 
    if(user.userType) newData.userType = user.userType; 
    if(user.companyId) newData.companyId = user.companyId; 

    const result = await prismaClient.users.update({
        where:{
            userId: userIdTarget,
        },
        data: {
            ...newData,
            updatedAt: getUTCTime(new Date().toISOString()),
        },
        select: {
            userId: true,
            username: true,
            email: true,
            fullName: true,
            userType: true,
            companyId: true,
            updatedAt: true,
            userPermissions: true,
        }
    });

    let userPermissions = {};
    if(user.permissionType){
        const permissionExist = await prismaClient.userPermissions.findFirst({
            where: {
                userId: result.userId,
            }
        });

        const updateResult = await prismaClient.userPermissions.update({
            where : {
                permissionId: permissionExist.permissionId,
            },
            data: {
                permissionType: user.permissionType,
                updatedAt: getUTCTime(new Date().toISOString()),
            }
        })

        userPermissions.permissionType = updateResult.permissionType;
    }else{
        userPermissions.permissionType = result.userPermissions[0].permissionType;
    }


    let roles;
    if(user.roleName){
        roles = await prismaClient.roles.findFirst({
            where: {
                roleName: user.roleName,
            }
        })

        if(!roles){
            roles = await prismaClient.roles.create({
                data: {
                    roleName: user.roleName,
                    createdAt: getUTCTime(new Date().toISOString()),
                    updatedAt: getUTCTime(new Date().toISOString()),
                }
            })
        }

        const roleId = roles.roleId;

        const userRoles = await prismaClient.userRoles.update({
            where: {
                userId: result.userId,
            },
            data: {
                roleId,
            }
        })

        roles = await prismaClient.roles.findFirst({
            where: {
                roleId: userRoles.roleId,
            }
        })

    }else{
        let userRoles = await prismaClient.userRoles.findFirst({
            where: {
                userId: result.userId,
            }
        });

        roles = await prismaClient.roles.findFirst({
            where: {
                roleId: userRoles.roleId,
            }
        })
    }

    return {
        userId: result.userId,
        username: result.username,
        email: result.email,
        fullName: result.fullName,
        userType: result.userType,
        companyId: result.companyId,
        updatedAt: result.updatedAt,
        permissionType: userPermissions.permissionType,
        roleName: roles.roleName,
    };
}

const detail = async (userLogin, userIdTarget) => {

    const user = await prismaClient.users.findFirst({
        where:{
            userId: userIdTarget,
        },
        select: {
            userId: true,
            username: true,
            email: true,
            fullName: true,
            userType: true,
            companyId: true,
            userPermissions: true,
            userRoles: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if(!user) throw new responseError(404, "User tidak ditemukan!"); 

    const roles = await prismaClient.roles.findFirst({
        where: {
            roleId: user.userRoles[0].roleId,
        }
    })

    return {
        userId: user.userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        companyId: user.companyId,
        permissionType: user.userPermissions[0].permissionType,
        roleName: roles.roleName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

export default {
    register,
    login,
    list,
    update,
    detail,
}