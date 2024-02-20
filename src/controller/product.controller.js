import productService from "../service/product.service.js";

const register = async (req,res, next) => {
    try {
        const result = await productService.register(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const update = async (req,res, next) => {
    try {
        const result = await productService.update(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const list = async (req,res, next) => {
    try {
        const result = await productService.list(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const detail = async (req, res, next) => {
    try {
        const result = await productService.detail(req.user, { productId: req.params.productId} );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.user, req.body);
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
    deleteProduct,
}