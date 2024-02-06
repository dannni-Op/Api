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
        const warehouseIdTarget = Number(req.params.warehouseId)
        const result = await warehouseService.update(req.user, warehouseIdTarget, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export default {
    register,
    update,
}