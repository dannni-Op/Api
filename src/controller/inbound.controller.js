import inboundService from "../service/inbound.service.js";

const create = async (req, res, next) => {
    try {
       const result = await inboundService.create(req.user, req.body);
       res.status(200).json(result);
    } catch (error) {
       next(error);
    }
}

const list = async (req, res, next) => {
    try {
       const result = await inboundService.list(req.user); 
       res.status(200).json(result);
    } catch (error) {
       next(error); 
    }
}

const detail = async (req, res, next) => {
    try {
       const result = await inboundService.detail(req.user, req.params.inboundId);
       console.log(result);
       res.status(200).json(result);
    } catch (error) {
       next(error); 
    }
}

const update = async (req, res, next) => {
    try {
       const result = await inboundService.update(req.user, req.body);
       res.status(200).json(result);
    } catch (error) {
       next(error);
    }
}

const deleteInbound = async (req, res, next) => {
    try {
      const result = await inboundService.deleteInbound(req.user, req.body);
      res.status(200).json(result);
    } catch (error) {
       next(error); 
    }
}

export {
    create,
    list,
    detail,
    update,
    deleteInbound,
}