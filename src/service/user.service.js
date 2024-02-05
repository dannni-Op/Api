import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    if(countUser === 1) throw new responseError(400,"Username sudah ada!");
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
        },
        select:{
            userId: true,
            username: true,
            email: true,
            fullName: true,
            userType: true,
        }
    });

    const resultPermission = await prismaClient.userPermissions.create({
        data: {
            userId: result.userId,
            permissionType: user.userPermission,
        }
    })
    return {
        ...result,
        PermissionType: resultPermission.permissionType,
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
            userPermissions: true
        }
    });
    if(!user) throw new responseError(401, "Username atau Password salah");
    const isPasswordTrue = await bcrypt.compare(data.password, user.password);
    if(!isPasswordTrue) throw new responseError(401, "Password salah!");

    const secretKey = "RAHASIA";
    const token = jwt.sign({
        userId: user.userId,
        username:user.username,
        email:user.email,
        fullName:user.fullName,
        userType:user.userType,
        userPermission: user.userPermissions[0].permissionType,
    },secretKey,{
        expiresIn: "3h",
    })

    return {
        data:{
            userId: user.userId,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            userType: user.userType,
        },
        token,
    };

}

const list = async (userLogin, data) => {
    // const resultValidation = validate(getUsersValidation, data);
    const users = await prismaClient.users.findMany({
        select:{
            userId: true,
            fullName: true,
            userType: true,
        }
        });

    if(users.length < 1) throw new responseError(404, "Users tidak ditemukan!");
    // if(users.length < 1 && !resultValidation.keywoard) return await prismaClient.users.findMany();

    return users;
}

const update = async (userLogin, data, userIdTarget) => {
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
    if(user.password) newData.password = user.password; 
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
        data: newData,
        select: {
            username: true,
            email: true,
            fullName: true,
            userType: true,           
        }
    });

    return result;
}

const detail = async (userLogin, userIdTarget) => {

    const user = await prismaClient.users.findFirst({
        where:{
            userId: userIdTarget,
        },
        select: {
            username: true,
            email: true,
            fullName: true,
            userType: true,
        }
    });

    if(!user) throw new responseError(404, "User tidak ditemukan!"); 

    return user;
}

export default {
    register,
    login,
    list,
    update,
    detail,
}