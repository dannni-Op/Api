import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { shelfIdValidation, shelfRegisterValidation, shelfUpdateValidation } from "../validation/shelf.validation.js";
import { validate } from "../validation/validation.js";
import { getId } from "./genereateId.service.js";
import { getUTCTime } from "./time.service.js";

const register = async (userLogin, data, log = true) => {
    const validationResult = validate(shelfRegisterValidation, data);

    const checkCode =  await prismaClient.shelf.findFirst({
        where: {
            shelfCode: validationResult.shelfCode,
        }
    });
    if(checkCode) throw new responseError(403, `Shelf dengan code : ${validationResult.shelfCode} sudah ada!`);

    const result = await prismaClient.shelf.create({
        data: {
            shelfId: getId(),
            shelfCode: validationResult.shelfCode,
            maxCapacity: validationResult.maxCapacity,
            createdAt: getUTCTime(),
            updatedAt: getUTCTime(),
        }
    })

    return result;
}

const list = async (userLogin, log = true) => {
    const result = await prismaClient.shelf.findMany(); 
    if(result.length < 1) throw new responseError(404, "List shelf kosong!")
    return result;
}

const detail = async (userLogin, shelfId, log = true) => {
    const validationResult = validate(shelfIdValidation, { shelfId, })

    const result = await prismaClient.shelf.findFirst({
        where:{
            shelfId: validationResult.shelfId,
        }
    })

    if(!result) throw new responseError(404, "Shelf tidak ditemukan!")
    return result;
}

const deleteShelf = async (userLogin, data, log = true) => {
    const validationResult = validate(shelfIdValidation, data);

    const check = await prismaClient.shelf.findFirst({
        where: {
            shelfId: validationResult.shelfId,
        }
    })

    if(!check) throw new responseError(404, "Shelf tidak ditemukan!");

    const result = await prismaClient.shelf.delete({
        where: {
            shelfId: validationResult.shelfId,
        }
    });

    return {
        "message": "Delete success",
    }
}

const update = async (userLogin, data, log = true) => {
    const validationResult = validate(shelfUpdateValidation, data);

    const isShelfExist = await prismaClient.shelf.findFirst({
        where: {
            shelfId: validationResult.shelfId,
        }
    })

    if(!isShelfExist) throw new responseError(404, "Shelf tidak ditemukan!");

    const newData = {};
    if(validationResult.maxCapacity){
        newData.maxCapacity = validationResult.maxCapacity;
    }

    const result = await prismaClient.shelf.update({
        data: {
            ...newData,
            updatedAt: getUTCTime(),
        },
        where: {
            shelfId: validationResult.shelfId,
        }
    })

    return result;
}

export default {
    register,
    list,
    detail,
    deleteShelf,
    update,
}