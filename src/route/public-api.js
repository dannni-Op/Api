import {login, register} from "../controller/user.constroller.js";
import express from "express";

const publicRouter = new express.Router();
publicRouter.post("/api/users/register", register);
publicRouter.post("/api/users/login", login);

export {
    publicRouter,
}