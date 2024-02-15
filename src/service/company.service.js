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
    
    if(resultValidation.companyName || resultValidation.companyCode){

        const countCompanies = await prismaClient.companies.count({
            where:{
                OR:[
                    {
                        companyName: resultValidation.companyName,
                    },
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

        if(countCompanies === 1) throw new responseError(400, "Company Name Company Code sudah ada!")
    }
    
    const result = await prismaClient.companies.update({
        where: {
            companyId: resultValidation.companyId,
        },
        data: {
            ...data,
            updatedAt: getUTCTime(new Date().toISOString()),
        },
    });

    return result;
}

const list = async (userIdLogin) => {
    const result = await prismaClient.companies.findMany({
        select: {
            companyId: true,
            companyCode: true,
            companyName: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    if(result.length < 1) throw new responseError(404, "Companies Kosong!");
    return result;
}

const detail = async (userLogin, companyIdTarget) => {
    const resultValidation = validate(companyIdValidation, { companyId: companyIdTarget});
    const result = await prismaClient.companies.findFirst({
        where: {
            companyId: companyIdTarget,
        },
        select: {
            companyId: true,
            companyCode: true,
            companyName: true,
            createdAt: true,
            updatedAt: true,
        }
    });
1
    if(!result) throw new responseError(404, "Company tidak ditemukan!");
    
    return result;
}

export default {
    register,
    update,
    list,
    detail,
}