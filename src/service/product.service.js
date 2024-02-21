import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { deleteProductValidation } from "../validation/product.validation.js";
import { listProductValidation } from "../validation/product.validation.js";
import { detailProductValidation } from "../validation/product.validation.js";
import { registerProductValidation, updateProductValidation } from "../validation/product.validation.js"
import { validate } from "../validation/validation.js";
import { createLog } from "./createLog.service.js";
import { createdBy } from "./created.service.js";
import { getId } from "./genereateId.service.js";
import { checkPermission } from "./permission.service.js";
import { getUTCTime } from "./time.service.js";


const register = async (userLogin, data) => {
    
    const validationResult = validate(registerProductValidation, data);

    const countProduct = await prismaClient.products.count({
        where: {
            sku: validationResult.sku,
        }
    })

    if(countProduct === 1) throw new responseError(401, "SKU product sudah terdaftar!");

    const checkName = await prismaClient.products.count({
        where: {
            name: validationResult.name,
        }
    })

    if(checkName === 1) throw new responseError(401, "Product name sudah terdaftar!");

    const product = await prismaClient.products.create({
        data: {
            productId: getId(),
            sku: validationResult.sku,
            name: validationResult.name,
            unit: validationResult.unit,
            companyId: validationResult.companyId,
            createdBy: await createdBy(userLogin.userId),
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        },
    })
    
    const log = await createLog("create", "/api/products/register", JSON.stringify({
        ...data,
    }), 201, userLogin.userId);
    
    return product;
}

const update = async (userLogin, data) => {
    const validationResult = validate(updateProductValidation, data);

    const isProductExist = await prismaClient.products.count({
        where: {
            productId: validationResult.productId,
        }
    })

    if(isProductExist !== 1) throw new responseError(404, "Product tidak ditemukan!");

    const newData = {};
    if(validationResult.sku){
        const isSkuExist = await prismaClient.products.count({
            where: {
                AND: [
                    {
                        sku: validationResult.sku,
                    },
                    {
                        NOT: {
                            productId: validationResult.productId,
                        }
                    }
                ]
            }
        });

        if(isSkuExist === 1) throw new responseError(401, "SKU product sudah terpakai!");
        newData.sku = validationResult.sku;
    }
    
    if(validationResult.name){
        const isNameExist = await prismaClient.products.count({
            where: {
                AND: [
                    {
                        name: validationResult.name,
                    },
                    {
                        NOT: {
                            productId: validationResult.productId,
                        }
                    }
                ]
            }
        });

        if(isNameExist === 1) throw new responseError(401, "Name product sudah terpakai!");
        newData.name = validationResult.name;
    }

    if(validationResult.unit) newData.unit = validationResult.unit;
    if(validationResult.companyId){
        const isCompanyExist = await prismaClient.companies.findFirst({
            where: {
                companyId: validationResult.companyId,
            }
        })
        if(!isCompanyExist) throw new responseError(404, "companyId tidak ada!");
        newData.companyId = validationResult.companyId;
    } 

    const product = await prismaClient.products.update({
        where: {
            productId: validationResult.productId,
        },
        data: { ...newData, updatedAt: getUTCTime(new Date().toISOString()), }
    })

    const log = await createLog("update", "/api/products", JSON.stringify({
        ...data,
    }), 200, userLogin.userId);

    return product;
}

const list = async (userLogin, data) => {
    const checkResult = await checkPermission(userLogin, "backOffice");
    const validationResult = validate(listProductValidation, data);
    const params = (validationResult.companyId) ? JSON.stringify({ ...data }) : null;

    if(!validationResult.companyId) {
        const result = await prismaClient.products.findMany();
        if(result.length < 1) throw new responseError(404, "Products kosong!");
        const log = await createLog("read", "/api/products", params, 200, userLogin.userId);
        return result;
    }

    const isCompanyExist = await prismaClient.companies.findFirst({
        where: {
            companyId: validationResult.companyId,
        }
    })

    if(!isCompanyExist) throw new responseError(404, "Company tidak ditemukan!");
    
    const result = await prismaClient.products.findMany({
        where:{
            companyId: validationResult.companyId,
        }
    });
    if(result.length < 1) throw new responseError(404, "Products kosong!");
    const log = await createLog("read", "/api/products", params, 200, userLogin.userId);
    return result;
}

const detail = async (userLogin, productId) => {
    const checkResult = await checkPermission(userLogin, "backOffice");
    const validationResult = validate(detailProductValidation, { productId, });
    const product = await prismaClient.products.findFirst({
        where: {
            productId: validationResult.productId,
        }
    });

    if(!product) throw new responseError(404, "Product tidak ditemukan!");

    const log = await createLog("read", "/api/products/"+productId, null, 200, userLogin.userId);

    return product;
}

const deleteProduct = async (userLogin, data) => {
    const validationResult = validate(deleteProductValidation, data);

    const isProductExist = await prismaClient.products.count({
        where: {
            productId: validationResult.productId,
        }
    })

    if(isProductExist === 0) throw new responseError(404, "Product tidak ditemukan!");

    const result = await prismaClient.products.delete({
        where: {
            productId: validationResult.productId,
        }
    });

    const log = await createLog("delete", "/api/products", JSON.stringify({
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
    deleteProduct,
}