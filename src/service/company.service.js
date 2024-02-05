import { registerCompanyValidation } from "../validation/company.validation.js"
import { validate } from "../validation/validation.js"
import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";

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

export default {
    register,
}