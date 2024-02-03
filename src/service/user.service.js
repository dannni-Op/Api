import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { getUsersValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user.validation.js";
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
    
    user.password = await bcrypt.hash(user.password, 10);
    const result = await prismaClient.users.create({
        data: user,
        select:{
            username: true,
            email: true,
            fullName: true,
            userType: true,
        }
    });
    
    return result;
}

const login = async (data) => {
    const resultValidation = validate(loginUserValidation, data);
    const user = await prismaClient.users.findFirst({
        where: {
            username: resultValidation.username,
        },
        select: {
            username: true,
            email: true,
            fullName: true,
            userType: true,
            password: true,
        }
    });
    if(!user) throw new responseError(401, "Username atau Password salah");
    const isPasswordTrue = await bcrypt.compare(data.password, user.password);
    if(!isPasswordTrue) throw new responseError(401, "Password salah!");

    const secretKey = "RAHASIA";
    const token = jwt.sign({
        username:user.username,
        email:user.email,
        fullName:user.fullName,
    },secretKey,{
        expiresIn: "3h",
    })

    return {
        data:{
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            userType: user.userType,
        },
        token,
    };

}

const list = async (data) => {
    const resultValidation = validate(getUsersValidation, data);

    const users = await prismaClient.users.findMany({
        where:{
            OR: [
                    { 
                        fullName: resultValidation.fullName
                    },
                    { 
                        userType: resultValidation.userType
                    }
                ]
            },
        select:{
            username: true,
            email: true,
            fullName: true,
            userType: true,
        }
        });

    if(users.length < 1) throw new responseError(404, "Users tidak ditemukan");

    return users;
}

const update = async (data, userIdTarget) => {
    const user = validate(updateUserValidation, data);

    const countUser = await prismaClient.users.count({
        where:{
            userId: userIdTarget,
        }
    });

    if(countUser !== 1) throw new responseError(404, "User tidak ditemukan!");

    const newData = {};
    if(user.username) newData.username = user.username; 
    if(user.password) newData.password = user.password; 
    if(user.email) newData.email = user.email; 
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

export default {
    register,
    login,
    list,
    update,
}