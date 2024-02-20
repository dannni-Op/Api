import { companyIdValidation, registerCompanyValidation, updateCompanyValidation } from "../validation/company.validation.js"
import { validate } from "../validation/validation.js"
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { checkPermission } from "./permission.service.js";
import { getUTCTime } from "./time.service.js";
import { getId } from "./genereateId.service.js";

const register = async (userLogin, data) => {
    const resultValidation = validate(registerCompanyValidation, data);

    const countCompanies = await prismaClient.companies.count({
        where:{
            companyCode: resultValidation.companyCode,
        } 
    });

    if(countCompanies === 1) throw new responseError(400, "Company code sudah ada!");

    const company = await prismaClient.companies.create({
        data: {
            companyId: getId(),
            ...resultValidation,
            createdAt: getUTCTime(new Date().toISOString()),
            updatedAt: getUTCTime(new Date().toISOString()),
        }
    });
    
    return company;
}

const update = async (userIdLogin, data) => {
    const resultValidation = validate(updateCompanyValidation, data);
    
    const newData = {};
    if(resultValidation.companyCode){

        const countCompanies = await prismaClient.companies.count({
            where:{
                OR:[
                    {
                        companyCode: resultValidation.companyCode,
                    }
                ],
                AND: [
                    {
                        NOT: {
                            companyId: resultValidation.companyId,
                        }
                    }
                ]
            } 
        });

        if(countCompanies === 1) throw new responseError(400, "Company code sudah ada!")
        newData.companyCode = resultValidation.companyCode;
    }
    
    if(resultValidation.companyName){

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
                            companyId: resultValidation.companyId,
                        }
                    }
                ]
            } 
        });

        if(countCompanies === 1) throw new responseError(400, "Company Name sudah ada!")
        newData.companyName = resultValidation.companyName;
    }
    
    const result = await prismaClient.companies.update({
        where: {
            companyId: resultValidation.companyId,
        },
        data: {
            ...newData,
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

const detail = async (userLogin, companyId ) => {
    const resultValidation = validate(companyIdValidation, { companyId, });
    const result = await prismaClient.companies.findFirst({
        where: {
            companyId,
        }
    });
1
    if(!result) throw new responseError(404, "Company tidak ditemukan!");
    
    return result;
}

const deleteCompany = async (userLogin, data) => {
    const validationResult = validate(companyIdValidation, data);

    const isCompanyExist = await prismaClient.companies.count({
        where: {
            companyId: validationResult.companyId,
        }
    })

    if(isCompanyExist === 0) throw new responseError(404, "Company tidak ditemukan!");

    const result = await prismaClient.companies.delete({
        where: {
            companyId: validationResult.companyId,
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