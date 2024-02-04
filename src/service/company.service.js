import { registerCompanyValidation } from "../validation/company.validation.js"
import { validate } from "../validation/validation.js"

const register = async (userLogin, data) => {
    const company = validate(registerCompanyValidation, data);
    return company;
}

export default {
    register,
}