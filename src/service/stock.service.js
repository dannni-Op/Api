import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { registerStockValidation, stockIdValidation, updateStockValidation } from "../validation/stock.validation.js";
import { validate } from "../validation/validation.js";
import { getId } from "./genereateId.service.js";
import { getUTCTime } from "./time.service.js";

const register = async (userLogin, data) => {
    const validationResult = validate(registerStockValidation, data);

    const isProductExist = await prismaClient.products.findFirst({
        where: {
            productId: validationResult.productId,
        }
    });

    if(!isProductExist) throw new responseError(404, "Product tidak ditemukan!");

    const isWarehouseExist = await prismaClient.warehouses.findFirst({
        where: {
            warehouseId: validationResult.warehouseId,
        }
    });

    if(!isWarehouseExist) throw new responseError(404, "Warehouse tidak ditemukan!");

    const checkProductStock = await prismaClient.stocks.count({
        where: {
            AND: [
                {
                    productId: validationResult.productId,
                },
                {
                    warehouseId: validationResult.warehouseId,
                }
            ]
        }
    });

    if(checkProductStock === 1) throw new responseError(403, "Product Stock sudah terdaftar!");
    
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
    if(result.length < 1) throw new responseError(404, "Product stock kosong!");
    return result;
}

const update = async (userLogin, data) => {
    const validationResult = validate(updateStockValidation, data);

    const stock = await prismaClient.stocks.findFirst({
        where: {
            stockId: validationResult.stockId,
        }
    });

    if(!stock) throw new responseError(404, "Product stock tidak ditemukan!");

    const check = await prismaClient.stocks.findFirst({
        where: {
            AND: [
                {
                    warehouseId: validationResult.warehouseId ?? stock.warehouseId,
                    productId: validationResult.productId ?? stock.productId,
                },
                {
                    NOT: {
                        stockId: validationResult.stockId,
                    }
                },
            ]
        }
    })

    if(check) throw new responseError(403, "Product stock sudah terdaftar!");
    
    const newData = {};

    if(validationResult.productId){
        const result = await prismaClient.products.findFirst({ where: {
            productId: validationResult.productId,
        } });
        if(!result) throw new responseError(404, "Product tidak ada!");

        newData.productId = validationResult.productId;
    }

    if(validationResult.warehouseId){
        const isWarehouseExist = await prismaClient.warehouses.count({
            where: {
                warehouseId: validationResult.warehouseId,
            }
        })
        if(isWarehouseExist === 0)throw new responseError(404, "Warehouse tidak ada!");
        
        newData.warehouseId = validationResult.warehouseId;
    }

    if(validationResult.stock) newData.stock = validationResult.stock;

    const result = await prismaClient.stocks.update({
        where: {
            stockId: stock.stockId,
        },
        data: {
            ...newData,
            updatedAt: getUTCTime(new Date().toISOString()),
        }
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

    if(!result) throw new responseError(404, "Product stock tidak ditemukan!");

    return result;
}


const deleteStock = async (userLogin, data) => {
    const validationResult = validate(stockIdValidation, data );
    const result = await prismaClient.stocks.count({
        where: {
            stockId: validationResult.stockId,
        }
    });

    if(result === 0) throw new responseError(404, "Product stock tidak ditemukan!");

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