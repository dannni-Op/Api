import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { validate } from "../validation/validation.js"
import { registerWarehousevalidation, updateWarehousevalidation } from "../validation/warehouse.validation.js";

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
        data: resultValidation,
    });

    return result;

}

const update = async (userLogin, warehouseIdTarget, data) => {
    const resultValidation = validate(updateWarehousevalidation, data);
    
    const isWarehouseExist = await prismaClient.warehouses.count({
        where:{
            id: warehouseIdTarget,
        }
    });

    if(isWarehouseExist === 0) throw new responseError(404, "Warehouse tidak ditemukan!");

    const newData = {};
    if(resultValidation.code) {

        const checkCode = await prismaClient.warehouses.count({
            where: {
                code: resultValidation.code,
            }
        })

        if(checkCode === 1) throw new responseError(401, "Code Warehouse sudah terpakai!");
        
        newData.code = resultValidation.code;
    }
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
            id: warehouseIdTarget,
        }
    });

    return resultUpdate;
    
}

export default {
    register,
    update,
}