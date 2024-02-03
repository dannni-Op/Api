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

export {
    register,
    login
};