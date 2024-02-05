import { companyIdValidation, registerCompanyValidation, updateCompanyValidation } from "../validation/company.validation.js"
import { validate } from "../validation/validation.js"
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { checkPermissionServerSide } from "./permission.service.js";

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
        data: resultValidation,
        select: {
            companyId: true,
            companyCode: true,
            companyName: true,
        }
    });
    
    return company;
}

const update = async (userIdLogin, companyIdTarget, data) => {
    const resultValidation = validate(updateCompanyValidation, data);
    
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
                        companyId: companyIdTarget,
                    }
                }
            ]
        } 
    });

    if(countCompanies === 1) throw new responseError(400, "Company Name Company Code sudah ada!")
    
    const result = await prismaClient.companies.update({
        where: {
            companyId: companyIdTarget,
        },
        data,
        select: {
            companyId: true,
            companyCode: true,
            companyName: true,
            updatedAt: true,
        }
    });

    return result;
}

const list = async (userIdLogin) => {
    const result = await prismaClient.companies.findMany({
        select: {
            companyId: true,
            companyName: true,
        }
    });
    return result;
}

const detail = async (userLogin, companyIdTarget) => {

    await checkPermission(userLogin, "list", "companies");
    
    const resultValidation = validate(companyIdValidation, { companyId: companyIdTarget})
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