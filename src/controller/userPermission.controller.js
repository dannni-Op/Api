import userPermissionsService from "../service/userPermissions.service.js";

const register = async (req, res, next) => {
    try {
        const result = await userPermissionsService.register(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const detail = async (req, res, next) => {
    try {
        const result = await userPermissionsService.detail(req.user, req.params.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const list = async (req, res, next) => {
    try {
        const result = await userPermissionsService.list(req.user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await userPermissionsService.update(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export {
    register,
    detail,
    list,
    update,
}