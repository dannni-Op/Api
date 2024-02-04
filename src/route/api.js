import {detail, list, update} from "../controller/user.constroller.js";
import {register as companyRegister} from "../controller/company.controller.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = new express.Router();
const companyRouter = new express.Router();

userRouter.use(authMiddleware);
companyRouter.use(authMiddleware);

//user
userRouter.post("/api/users", list);
userRouter.patch("/api/users/:userId", update);
userRouter.get("/api/users/:userId", detail);

//company
companyRouter.post("/api/companies/register", companyRegister);

export {
    userRouter,
    companyRouter,
}