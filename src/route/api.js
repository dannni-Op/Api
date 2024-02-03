import {getUsers} from "../controller/user.constroller.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = new express.Router();

userRouter.use(authMiddleware);
userRouter.post("/api/users", getUsers);

export {
    userRouter,
}