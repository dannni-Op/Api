import { responseError } from "../error/response.error.js";

const errorMiddleware = async (err, req, res, next) => {
    if(!err) return next();
    if(err instanceof responseError) {
        res.status(err.status).json({
            errors: err.message,
        }).end();
    }else{
        res.status(500).json({
            errors: err.message,
        }).end();
    }
}

export {
    errorMiddleware,
}