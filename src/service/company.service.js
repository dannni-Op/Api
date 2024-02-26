import { companyIdValidation, registerCompanyValidation, updateCompanyValidation } from "../validation/company.validation.js"
import { validate } from "../validation/validation.js"
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { checkPermission } from "./permission.service.js";
import { getUTCTime } from "./time.service.js";
import { getId } from "./genereateId.service.js";
import { createdBy } from "./created.service.js";
import { createLog } from "./createLog.service.js";

const register = async (userLogin, data, log = true) => {
    const resultValidation = validate(registerCompanyValidation, data);

    const countCompanies = await prismaClient.companies.count({
        where:{
            companyCode: resultValidation.companyCode,
        } 
    });

    if(countCompanies === 1) throw new responseError(400, "Company code sudah ada!");

    const checkName = await prismaClient.companies.count({
        where:{
            companyName: resultValidation.companyName,
        } 
    });

    if(checkName === 1) throw new responseError(400, "Company name sudah ada!");

    const company = await prismaClient.companies.create({
        data: {
            companyId: getId(),
            ...resultValidation,
            createdBy: await createdBy(userLogin.userId),
            createdAt: getUTCTime(),
            updatedAt: getUTCTime(),
        }
    });

    if(log){
        const log = await createLog("create", "/api/companies/register", JSON.stringify({
            ...data,
        }), 201, userLogin.userId);
    }
    
    return company;
}

const update = async (userLogin, data, log = true) => {
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
            updatedAt: getUTCTime(),
        },
    });

    if(log){
        const log = await createLog("update", "/api/companies", JSON.stringify({
            ...data,
        }), 200, userLogin.userId);
    }

    return result;
}

const list = async (userLogin, log = true) => {
    const result = await prismaClient.companies.findMany();
    if(result.length < 1) throw new responseError(404, "Companies Kosong!");

    if(log){
        const log = await createLog("read", "/api/companies", null, 200, userLogin.userId);
    }
    return result;
}

const detail = async (userLogin, companyId, log = true ) => {
    const resultValidation = validate(companyIdValidation, { companyId, });
    const result = await prismaClient.companies.findFirst({
        where: {
            companyId,
        }
    });
1
    if(!result) throw new responseError(404, "Company tidak ditemukan!");

    if(log){
        const log = await createLog("read", "/api/companies/"+companyId, null,200, userLogin.userId);
    }
    return result;
}

const deleteCompany = async (userLogin, data, log = true) => {
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

    if(log){
        const log = await createLog("delete", "/api/companies", JSON.stringify({
            ...data,
        }), 200, userLogin.userId);
    }
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