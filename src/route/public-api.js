import {login, register} from "../controller/user.constroller.js";
import express from "express";
import { register as userPermissionRegister } from "../controller/userPermission.controller.js";

const publicRouter = new express.Router();
publicRouter.post("/api/users/register", register);
publicRouter.post("/api/users/login", login);
publicRouter.post("/api/user-permissions/register", userPermissionRegister);

export {
    publicRouter,
}