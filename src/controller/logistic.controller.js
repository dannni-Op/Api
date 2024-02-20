import logisticService from "../service/logistic.service.js";

const register = async (req, res, next) => {
    try {
        const result = await logisticService.register(req.user, req.body);
        res.status(200).json(result);        
    } catch (error) {
        next(error);
    }
}

const list = async (req, res, next) => {
    try {
        const result = await logisticService.list(req.user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const detail = async (req, res, next) => {
    try {
        const result = await logisticService.detail(req.user, req.params.logisticId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await logisticService.update(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const deleteLogistic = async (req, res, next) => {
    try {
        const result = await logisticService.deleteLogistic(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export {
    register,
    list,
    detail,
    update,
    deleteLogistic,
}