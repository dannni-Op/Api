import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { validate } from "../validation/validation.js";
import { getUTCTime } from "./time.service.js";
import { registerWarehousevalidation, updateWarehousevalidation, warehouseIdValidation } from "../validation/warehouse.validation.js";
import { checkPermission } from "./permission.service.js";
import { getId } from "./genereateId.service.js";
import { createdBy } from "./created.service.js";
import { createLog } from "./createLog.service.js";

const register = async (userLogin, data) => {

    const checkResult = await checkPermission(userLogin, "backOffice");
    const resultValidation = validate(registerWarehousevalidation, data);

    const warehouse = await prismaClient.warehouses.count({
        where: {
            code: resultValidation.code
        }
    });


    if(warehouse === 1) throw new responseError(401, "Warehouse code sudah ada!");

    const warehouseName = await prismaClient.warehouses.count({
        where: {
            name: resultValidation.name,
        }
    });


    if(warehouseName === 1) throw new responseError(401, "Warehouse name sudah ada!");

    
    const result = await prismaClient.warehouses.create({
        data: {
            warehouseId: getId(),
            ...resultValidation,
            createdBy: await createdBy(userLogin.userId),
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        },
    });

    const log = await createLog("create", "/api/warehouses/register", JSON.stringify({
        ...data,
    }), 201, userLogin.userId);
    
    return result;

}

const update = async (userLogin, data) => {
    const checkResult = await checkPermission(userLogin, "backOffice");
    const resultValidation = validate(updateWarehousevalidation, data);
    
    const isWarehouseExist = await prismaClient.warehouses.count({
        where:{
            warehouseId: resultValidation.warehouseId,
        }
    });

    if(isWarehouseExist === 0) throw new responseError(404, "Warehouse tidak ditemukan!");

    const newData = {};

    if(resultValidation.code) {

        const checkCode = await prismaClient.warehouses.count({
            where: {
                AND: [
                    {
                        code: resultValidation.code,
                    },
                    {
                        NOT: {
                            warehouseId: resultValidation.warehouseId,
                        }
                    }
                ]
            }
        })

        if(checkCode === 1) throw new responseError(401, "Warehouse code sudah ada!");
        
        newData.code = resultValidation.code;
    }
    
    if(resultValidation.name) {

        const checkName = await prismaClient.warehouses.count({
            where: {
                AND: [
                    {
                        name: resultValidation.name,
                    },
                    {
                        NOT: {
                            warehouseId: resultValidation.warehouseId,
                        }
                    }
                ]
            }
        })

        if(checkName === 1) throw new responseError(401, "Name Warehouse sudah ada!");
        
        newData.name = resultValidation.name;
    }
    if(resultValidation.address) newData.address = resultValidation.address;
    if(resultValidation.status) newData.status = resultValidation.status;

    newData.updatedAt = getUTCTime(new Date().toISOString());
    const resultUpdate = await prismaClient.warehouses.update({
        data: newData,
        where:{
            warehouseId: resultValidation.warehouseId,
        }
    });

    const log = await createLog("update", "/api/warehouses", JSON.stringify({
        ...data,
    }), 200, userLogin.userId);
    
    return resultUpdate;
    
}

const list = async (userLogin) => {
    const checkResult = await checkPermission(userLogin, "backOffice");
    const result = await prismaClient.warehouses.findMany();
    if(result.length < 1) throw new responseError(404, "Warehouses Kosong");

    const log = await createLog("read", "/api/warehouses", null, 200, userLogin.userId);
    return result;
}

const detail = async (userLogin, warehouseId ) => {
    const checkResult = await checkPermission(userLogin, "backOffice");
    const resultValidation = validate(warehouseIdValidation, { warehouseId, });
    const warehouse = await prismaClient.warehouses.findFirst({
        where: {
            code: resultValidation.id,
        }
    });

    if(!warehouse) throw new responseError(404, "Warehouse tidak ditemukan!");
    const log = await createLog("read", "/api/warehouses/"+warehouseId, null, 200, userLogin.userId);
    return warehouse;
}

const deleteWarehouse = async (userLogin, data ) => {
    const checkResult = await checkPermission(userLogin, "backOffice");
    const resultValidation = validate(warehouseIdValidation, data);
    
    const countWarehouse = await prismaClient.warehouses.count({
        where: {
            warehouseId: resultValidation.warehouseId,
        }
    });

    if(!countWarehouse) throw new responseError(404, "Warehouse tidak ditemukan!");

    const result = await prismaClient.warehouses.delete({
        where: {
            warehouseId: resultValidation.warehouseId,
        }
    });

    const log = await createLog("delete", "/api/warehouses", JSON.stringify({
        ...data,
    }), 200, userLogin.userId);
    
    return {
        message: "Delete Success",
    }
}

export default {
    register,
    update,
    list,
    detail,
    deleteWarehouse,
}