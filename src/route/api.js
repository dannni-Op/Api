import {detail, list, update} from "../controller/user.constroller.js";
import {register as companyRegister, update as companyUpdate, list as companyList, detail as companyDetail} from "../controller/company.controller.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = new express.Router();
const companyRouter = new express.Router();

userRouter.use(authMiddleware);
companyRouter.use(authMiddleware);

//user
userRouter.patch("/api/users/:userId", update);
userRouter.get("/api/users", list);
userRouter.get("/api/users/:userId", detail);

//company
companyRouter.post("/api/companies/register", companyRegister);
companyRouter.patch("/api/companies/update/:companyId", companyUpdate);
companyRouter.get("/api/companies", companyList);
companyRouter.get("/api/companies/:companyId", companyDetail);

export {
    userRouter,
    companyRouter,
}