import userService from "../service/user.service.js";

const register = async (req,res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const login = async (req,res,next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const list = async (req,res,next) => {
    try {
        const result = await userService.list(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

const update = async (req,res,next) => {
    const userIdTarget = Number(req.params.userId);
    try {
        const result = await userService.update(req.body, userIdTarget);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const detail = async (req,res,next) => {
    const userIdTarget = Number(req.params.userId);
    try {
        const result = await userService.detail(userIdTarget);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export {
    register,
    login,
    list,
    update,
    detail,
}