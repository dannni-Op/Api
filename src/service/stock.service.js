import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { registerStockValidation, stockIdValidation, updateStockValidation } from "../validation/stock.validation.js";
import { validate } from "../validation/validation.js";
import { getId } from "./genereateId.service.js";
import { getUTCTime } from "./time.service.js";

const register = async (userLogin, data) => {
    const validationResult = validate(registerStockValidation, data);

    const isProductExist = await prismaClient.stocks.count({
        where: {
            sku: validationResult.sku,
        }
    });

    if(isProductExist === 1) throw new responseError(403, "Product Stock sudah terdaftar!");

    const result = await prismaClient.stocks.create({
        data: {
            stockId: getId(),
            ...validationResult,
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        }
    });

    return result;
}

const list = async (userLogin) => {
    const result = await prismaClient.stocks.findMany();
    if(result.length < 1) throw new responseError(404, "Stock kosong!");
    return result;
}

const update = async (userLogin, data) => {
    const validationResult = validate(updateStockValidation, data);

    const isStockExist = await prismaClient.stocks.count({
        where: {
            sku: validationResult.sku,
        }
    });

    if(isStockExist === 0) throw new responseError(404, "Stock tidak ditemukank!");

    const stock = await prismaClient.stocks.findFirst({ where: { sku: validationResult.sku } });
    
    const newData = {};
    if(validationResult.code){
        const isWarehouseExist = await prismaClient.warehouses.count({
            where: {
                code: validationResult.code,
            }
        })
        if(isWarehouseExist === 0)throw new responseError(404, "Warehouse tidak ada!");
        newData.code = validationResult.code;
    }

    if(validationResult.companyCode){
        const isCompanyExist = await prismaClient.companies.count({
            where: {
                companyCode: validationResult.companyCode,
            }
        });
        if(isCompanyExist === 0) throw new responseError(404, "Company tidak ada!")
        newData.companyCode = validationResult.companyCode;
    }

    if(validationResult.stock) newData.stock = validationResult.stock;

    const result = await prismaClient.stocks.update({
        where: {
            stockId: stock.stockId,
        },
        data: newData,
    });

    return result;
}

const detail = async (userLogin, stockId) => {
    const validationResult = validate(stockIdValidation, { stockId, })

    const result = await prismaClient.stocks.findFirst({
        where: {
            stockId: validationResult.stockId,
        }
    });

    if(!result) throw new responseError(404, "Stock tidak ditemukan!");

    return result;
}


const deleteStock = async (userLogin, data) => {
    const validationResult = validate(stockIdValidation, data );
    const result = await prismaClient.stocks.count({
        where: {
            stockId: validationResult.stockId,
        }
    });

    if(result === 0) throw new responseError(404, "Stock tidak ditemukan!");

    await prismaClient.stocks.delete({
        where: {
            stockId: validationResult.stockId,
        }
    })

    return {
        "message": "Delete success",
    }
}

export default {
    register,
    list,
    update,
    detail,
    deleteStock,
}