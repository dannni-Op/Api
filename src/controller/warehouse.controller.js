import  warehouseService from "./../service/warehouse.service.js";

const register = async (req,res, next) => {
    try {
        const result = await warehouseService.register(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await warehouseService.update(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const list = async (req, res, next) => {
    try {
        const result = await warehouseService.list(req.user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const detail = async(req, res, next) => {
    try {
        const warehouseIdTarget = req.params.warehouseId;
        const result = await warehouseService.detail(req.user, warehouseIdTarget);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const deleteWarehouse = async (req, res, next) => {
    try {
        const result = await warehouseService.deleteWarehouse(req.user, req.body);
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
    deleteWarehouse,
}