import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { validate } from "../validation/validation.js"
import { registerWarehousevalidation, updateWarehousevalidation, warehouseCodeValidation } from "../validation/warehouse.validation.js";

const register = async (userLogin, data) => {

    const resultValidation = validate(registerWarehousevalidation, data);

    const warehouse = await prismaClient.warehouses.count({
        where: {
            OR: [
                {
                    code: resultValidation.code
                },
                {
                    name: resultValidation.name,
                }
            ]
        }
    });


    if(warehouse === 1) throw new responseError(401, "Warehouse sudah ada!");

    
    const result = await prismaClient.warehouses.create({
        data: {
            ...resultValidation,
        },
    });

    return result;

}

const update = async (userLogin, data) => {
    const resultValidation = validate(updateWarehousevalidation, data);
    
    const isWarehouseExist = await prismaClient.warehouses.count({
        where:{
            code: resultValidation.code,
        }
    });

    if(isWarehouseExist === 0) throw new responseError(404, "Warehouse tidak ditemukan!");

    const newData = {};
    if(resultValidation.name) {

        const checkName = await prismaClient.warehouses.count({
            where: {
                name: resultValidation.name,
            }
        })

        if(checkName === 1) throw new responseError(401, "Name Warehouse sudah terpakai!");
        
        newData.name = resultValidation.name;
    }
    if(resultValidation.address) newData.address = resultValidation.address;
    if(resultValidation.status) newData.status = resultValidation.status;

    const resultUpdate = await prismaClient.warehouses.update({
        data: newData,
        where:{
            code: resultValidation.code,
        }
    });

    return resultUpdate;
    
}

const list = async (userLogin) => {
    const result = await prismaClient.warehouses.findMany();
    if(result.length < 1) throw new responseError(404, "Warehouses Kosong");
    return result;
}

const detail = async (userLogin, warehouseIdTarget) => {

    const resultValidation = validate(warehouseCodeValidation, { code: warehouseIdTarget });
    const countWarehouse = await prismaClient.warehouses.count({
        where: {
            code: resultValidation.id,
        }
    });

    if(!countWarehouse) throw new responseError(404, "Warehouse tidak ditemukan!");
    
    const result = await prismaClient.warehouses.findFirst({
        where: {
            code: resultValidation.code,
        }
    });

    return result;
}

const deleteWarehouse = async (userLogin, data ) => {

    const resultValidation = validate(warehouseCodeValidation, data);
    
    const countWarehouse = await prismaClient.warehouses.count({
        where: {
            code: resultValidation.code,
        }
    });

    if(!countWarehouse) throw new responseError(404, "Warehouse tidak ditemukan!");

    const result = await prismaClient.warehouses.delete({
        where: {
            code: resultValidation.code,
        }
    });

    return {
        message: "Deleted Success",
    }
}

export default {
    register,
    update,
    list,
    detail,
    deleteWarehouse,
}