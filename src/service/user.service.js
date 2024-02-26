import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { idUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { checkPermission } from "./permission.service.js";
import { getUTCTime } from "./time.service.js";
import { getId } from "./genereateId.service.js";
import { createLog } from "./createLog.service.js";

const register = async (data, log = true) => {
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

    const uuid = getId();
    const result = await prismaClient.users.create({
        data: {
            userId: uuid,
            username: user.username,
            password: user.password,
            email: user.email,
            fullName: user.fullName,
            userType: user.userType,
            companyId: user.companyId,
            createdAt: getUTCTime(),
            updatedAt: getUTCTime(),
        },
        select:{
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

    if(log){
        const log = await createLog("create", "/api/users/register", JSON.stringify({
            ...data,
            password: user.password,
        }), 201, null);
    }
    
    return result ;
}

const login = async (data, log = true) => {
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
            updatedAt: true,
        }
    });
    if(!user) throw new responseError(401, "Username atau Password salah");
    const isPasswordTrue = await bcrypt.compare(data.password, user.password);
    if(!isPasswordTrue) throw new responseError(401, "Password salah!");

    const token = jwt.sign({
        key: user.userId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: "3h",
    });

    if(log){
        const log = await createLog("login", "/api/users/login", JSON.stringify({
            ...data,
            password: user.password,
        }), 200, user.userId);
    }

    return {
        data:{
            userId: user.userId,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            userType: user.userType,
            companyId: user.companyId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        token,
    };

}

const list = async (userLogin, log = true) => {

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

    if(log){
        const log = await createLog("read", "/api/users", null, 200, userLogin.userId);
    }

    return users;
}

const update = async (userLogin, data, log = true) => {
    // const resultPermission = await checkPermission(userLogin);
    // if(!resultPermission) throw new responseError(401, "Akses ditolak");
    const user = validate(updateUserValidation, data);

    const checkUser = await prismaClient.users.findFirst({
        where:{
            userId: user.userId,
        }
    });

    if(!checkUser) throw new responseError(404, "User tidak ditemukan!");

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
                            userId: user.userId,
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
                            userId: user.userId,
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
    if(user.companyId) {
        (user.companyCode === "null") ? newData.companyId = null : newData.companyId = user.companyId; 
    }

    const result = await prismaClient.users.update({
        where:{
            userId: user.userId,
        },
        data: {
            ...newData,
            updatedAt: getUTCTime(),
        },
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

    if(log){
        if(user.password){
            const log = await createLog("update", "/api/users", JSON.stringify({
                ...data,
                password: newData.password,
            }), 200, userLogin.userId);
        }else{
            const log = await createLog("update", "/api/users", JSON.stringify({
                ...data,
            }), 200, userLogin.userId);
        }
    }
    
    
    return result ;
}

const detail = async (userLogin, userId, log = true) => {

    const user = await prismaClient.users.findFirst({
        where:{
            userId,
        },
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

    if(!user) throw new responseError(404, "User tidak ditemukan!"); 

    if(log){
        const log = await createLog("read", "/api/users/"+userId, null, 200, userLogin.userId);
    }
    
    return {
        userId: user.userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        companyId: user.companyId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

const deleteUser = async (userLogin, data, log = true) => {
    const validationResult = validate(idUserValidation, data);

    const isUserExist = await prismaClient.users.findFirst({
        where: {
            userId: validationResult.userId,
        },
        select: {
            userPermissions: true,
        }
    });

    if(!isUserExist) throw new responseError(404, "User tidak ditemukan!");

    if(isUserExist.userPermissions.length !== 0){
        await prismaClient.userPermissions.delete({
            where: {
                userId: validationResult.userId,
            }
        });
    }
    

    const result = await prismaClient.users.delete({
        where: {
            userId: validationResult.userId,
        }
    });

    if(log){
        const log = await createLog("delete", "/api/users", JSON.stringify({
            ...data,
        }), 200, userLogin.userId);
    }

    return {
        message: "Delete success",
    };
}

export default {
    register,
    login,
    list,
    update,
    detail,
    deleteUser,
}