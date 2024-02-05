import companyService from "./../service/company.service.js";

const register = async (req, res, next) => {
    try {
        const result = await companyService.register(req.user, req.body);
        res.status(200).json({
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

export {
    register,
}