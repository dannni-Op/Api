import { companyCodeValidation, registerCompanyValidation, updateCompanyValidation } from "../validation/company.validation.js"
import { validate } from "../validation/validation.js"
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { checkPermission } from "./permission.service.js";
import { getUTCTime } from "./time.service.js";

const register = async (userLogin, data) => {
    const resultValidation = validate(registerCompanyValidation, data);

    const countCompanies = await prismaClient.companies.count({
        where:{
            OR:[
                {
                    companyName: resultValidation.companyName,
                },
                {
                    companyCode: resultValidation.companyCode,
                }
            ]
        } 
    });

    if(countCompanies === 1) throw new responseError(400, "Company Name atau Company Code sudah ada!");

    const company = await prismaClient.companies.create({
        data: {
            ...resultValidation,
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        }
    });
    
    return company;
}

const update = async (userIdLogin, data) => {
    const resultValidation = validate(updateCompanyValidation, data);
    
    if(resultValidation.companyName || resultValidation.companyCode){

        const countCompanies = await prismaClient.companies.count({
            where:{
                OR:[
                    {
                        companyName: resultValidation.companyName,
                    }
                ],
                AND: [
                    {
                        NOT: {
                            companyCode: resultValidation.companyCode,
                        }
                    }
                ]
            } 
        });

        if(countCompanies === 1) throw new responseError(400, "Company Name sudah ada!")
    }
    
    const result = await prismaClient.companies.update({
        where: {
            companyCode: resultValidation.companyCode,
        },
        data: {
            companyName: resultValidation.companyName,
            updatedAt: getUTCTime(new Date().toISOString()),
        },
    });

    return result;
}

const list = async (userIdLogin) => {
    const result = await prismaClient.companies.findMany();
    if(result.length < 1) throw new responseError(404, "Companies Kosong!");
    return result;
}

const detail = async (userLogin, companyCodeTarget) => {
    const resultValidation = validate(companyCodeValidation, { companyCode: companyCodeTarget});
    const result = await prismaClient.companies.findFirst({
        where: {
            companyCode: companyCodeTarget,
        }
    });
1
    if(!result) throw new responseError(404, "Company tidak ditemukan!");
    
    return result;
}

const deleteCompany = async (userLogin, data) => {
    const validationResult = validate(companyCodeValidation, data);

    const isCompanyExist = await prismaClient.companies.count({
        where: {
            companyCode: validationResult.companyCode,
        }
    })

    if(isCompanyExist === 0) throw new responseError(404, "Company tidak ditemukan!");

    const result = await prismaClient.companies.delete({
        where: {
            companyCode: validationResult.companyCode,
        }
    })

    return {
        message: "Delete Success",
    }
}

export default {
    register,
    update,
    list,
    detail,
    deleteCompany,
}