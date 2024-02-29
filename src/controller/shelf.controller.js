import shelfService from "../service/shelf.service.js";

const register = async (req, res, next) => {
    try {
       const result = await shelfService.register(req.user, req.body);
       res.status(200).json(result);
    } catch (error) {
       next(error);
    }
}

const detail = async (req, res, next) => {
    try {
       const result = await shelfService.detail(req.user, req.params.shelfId);
       res.status(200).json(result);
    } catch (error) {
       next(error);
    }
}

const list = async (req, res, next) => {
    try {
       const result = await shelfService.list(req.user);
       res.status(200).json(result);
    } catch (error) {
       next(error);
    }
}

const update = async (req, res, next) => {
    try {
       const result = await shelfService.update(req.user, req.body);
       res.status(200).json(result);
    } catch (error) {
       next(error); 
    }
}

const shelfDelete = async (req,res, next) => {
    try {
       const result = await shelfService.deleteShelf(req.user, req.body);
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
   shelfDelete,
}