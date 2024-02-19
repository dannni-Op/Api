import materialService from "../service/material.service.js"

const register = async (req, res, next) => {
    try {
        const result = await materialService.register(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const list = async (req, res, next) => {
    try {
        const result = await materialService.list(req.user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const detail = async (req, res, next) => {
    try {
        const result = await materialService.detail(req.user, req.params.materialId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await materialService.update(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const deleteMaterial = async (req, res, next) => {
    try {
        const result = await materialService.deleteMaterial(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export {
    register,
    list,
    detail,
    update,
    deleteMaterial,
}