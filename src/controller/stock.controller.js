import stockService from "../service/stock.service.js";

const register = async (req, res, next) => {
    try {
        const result = await stockService.register(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const list = async (req, res, next) => {
    try {
        const result = await stockService.list(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await stockService.update(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const detail = async (req, res, next) => {
    try {
        const result = await stockService.detail(req.user, req.params.stockId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}


const deleteStock = async (req, res, next) => {
    try {
        const result = await stockService.deleteStock(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export {
    register,
    list,
    update,
    detail,
    deleteStock
}