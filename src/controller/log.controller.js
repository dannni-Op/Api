import logService from "../service/log.service.js"

const list = async (req,res, next) => {
    try {
        const result = await logService.list(req.user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const detail = async (req, res, next) => {
    try {
        const result = await logService.detail(req.user, Number(req.params.logId));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export {
    list,
    detail,
}