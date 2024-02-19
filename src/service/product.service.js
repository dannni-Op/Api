import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { deleteProductValidation } from "../validation/product.validation.js";
import { listProductValidation } from "../validation/product.validation.js";
import { detailProductValidation } from "../validation/product.validation.js";
import { registerProductValidation, updateProductValidation } from "../validation/product.validation.js"
import { validate } from "../validation/validation.js";
import { checkPermission } from "./permission.service.js";
import { getUTCTime } from "./time.service.js";


const register = async (userLogin, data) => {
    
    const validationResult = validate(registerProductValidation, data);

    const countProduct = await prismaClient.products.count({
        where: {
            OR: [
                {
                    sku: validationResult.sku,
                },
                {
                    name: validationResult.name,
                }
            ]
        }
    })

    if(countProduct === 1) throw new responseError(401, "SKU atau name product sudah terdaftar!");

    const product = await prismaClient.products.create({
        data: {
            sku: validationResult.sku,
            name: validationResult.name,
            unit: validationResult.unit,
            companyCode: validationResult.companyCode,
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        },
    })
    
    return product;
}

const update = async (userLogin, data) => {
    const validationResult = validate(updateProductValidation, data);

    const isProductExist = await prismaClient.products.count({
        where: {
            sku: validationResult.sku,
        }
    })

    if(isProductExist !== 1) throw new responseError(404, "Product tidak ditemukan!");

    const newData = {};
    if(validationResult.name){
        const isNameExist = await prismaClient.products.count({
            where: {
                AND: [
                    {
                        name: validationResult.name,
                    },
                    {
                        NOT: {
                            sku: validationResult.sku,
                        }
                    }
                ]
            }
        });

        if(isNameExist === 1) throw new responseError(401, "Name product sudah terpakai!");
        newData.name = validationResult.name;
    }

    if(validationResult.unit) newData.unit = validationResult.unit;
    if(validationResult.companyCode) newData.companyCode = validationResult.companyCode;

    const product = await prismaClient.products.update({
        where: {
            sku: validationResult.sku,
        },
        data: { ...newData, updatedAt: getUTCTime(new Date().toISOString()), }
    })

    return product;
}

const list = async (userLogin, data) => {
    const checkResult = await checkPermission(userLogin, "backOffice", "All");
    const validationResult = validate(listProductValidation, data);

    if(!validationResult.companyCode) {
        const result = await prismaClient.products.findMany();
        if(result.length < 1) throw new responseError(404, "Products kosong!");
        return result;
    }

    const isCompanyExist = await prismaClient.companies.findFirst({
        where: {
            companyCode: validationResult.companyCode,
        }
    })

    if(!isCompanyExist) throw new responseError(404, "Company tidak ditemukan!");
    
    const result = await prismaClient.products.findMany({
        where:{
            companyCode: validationResult.companyCode,
        }
    });
    if(result.length < 1) throw new responseError(404, "Products kosong!");

    return result;
}

const detail = async (userLogin, data) => {
    const validationResult = validate(detailProductValidation, data);
    const product = await prismaClient.products.findFirst({
        where: {
            sku: validationResult.sku,
        }
    });

    if(!product) throw new responseError(404, "Product tidak ditemukan!");

    return product;
}

const deleteProduct = async (userLogin, data) => {
    const validationResult = validate(deleteProductValidation, data);

    const isProductExist = await prismaClient.products.count({
        where: {
            sku: validationResult.sku,
        }
    })

    if(isProductExist === 0) throw new responseError(404, "Product tidak ditemukan!");

    const result = await prismaClient.products.delete({
        where: {
            sku: validationResult.sku,
        }
    });

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