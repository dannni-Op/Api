import companyService from "./../service/company.service.js";

const register = async (req, res) => {
    try {
        const result = await companyService.register(req.user, req.body);
        res.end();
    } catch (error) {
        
    }
}

export {
    register,
}