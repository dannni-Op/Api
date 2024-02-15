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

const update = async (req, res, next) => {
    try{
        const result = await companyService.update(req.user, req.body);
        res.status(200).json({
            ...result,
        })
    }catch(error){
        next(error);
    }
    
}

const list = async (req, res, next) => {
    try {
        const result = await companyService.list(req.user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const detail = async (req, res, next) => {
    try {
        const companyCodeTarget = req.params.companyCode;
        const result = await companyService.detail(req.user, companyCodeTarget);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const deleteCompany = async (req, res, next) => {
    try {
        const result = await companyService.deleteCompany(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export {
    register,
    update,
    list,
    detail,
    deleteCompany
}