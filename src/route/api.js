import {detail, list, update, deleteUser as userDelete } from "../controller/user.constroller.js";
import { register as userPermissionRegister, detail as userPermissionDetail, list as userPermissionList, update as userPermissionUpdate } from "../controller/userPermission.controller.js";
import {register as companyRegister, update as companyUpdate, list as companyList, detail as companyDetail, deleteCompany as companyDelete} from "../controller/company.controller.js";
import {register as warehouseRegister, update as warehouseUpdate, list as warehouseList, detail as warehouseDetail, deleteWarehouse as warehouseDelete} from "../controller/warehouse.controller.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {register as productRegister, update as productUpdate, list as productList, detail as productDetail, deleteProduct as productDelete } from "../controller/product.controller.js";
import { register as logisticRegistert, list as logisticList, detail as logisticDetail, update as logisticUpdate, deleteLogistic as logisticDelete } from "../controller/logistic.controller.js";
import { deleteStock as stockDelete, register as stockRegister, list as stockList, update as stockUpdate, detail as stockDetail } from "../controller/stock.controller.js";

const userRouter = new express.Router();
const companyRouter = new express.Router();
const warehouseRouter = new express.Router();
const productRouter = new express.Router();
const logisticRouter = new express.Router();
const stockRouter = new express.Router();
const userPermissionRouter = new express.Router();

userRouter.use(authMiddleware);
companyRouter.use(authMiddleware);
warehouseRouter.use(authMiddleware);
productRouter.use(authMiddleware);
logisticRouter.use(authMiddleware);
stockRouter.use(authMiddleware);
userPermissionRouter.use(authMiddleware);

//user
userRouter.patch("/api/users", update);
userRouter.get("/api/users", list);
userRouter.get("/api/users/:userId", detail);
userRouter.delete("/api/users", userDelete);

//user permission
userPermissionRouter.post("/api/user-permissions/register", userPermissionRegister);
userPermissionRouter.get("/api/user-permissions/:userId", userPermissionDetail);
userPermissionRouter.get("/api/user-permissions", userPermissionList);
userPermissionRouter.patch("/api/user-permissions", userPermissionUpdate);

//company
companyRouter.post("/api/companies/register", companyRegister);
companyRouter.patch("/api/companies", companyUpdate);
companyRouter.delete("/api/companies", companyDelete);
companyRouter.get("/api/companies", companyList);
companyRouter.get("/api/companies/:companyCode", companyDetail);

//warehouse
warehouseRouter.post("/api/warehouses/register", warehouseRegister);
warehouseRouter.patch("/api/warehouses", warehouseUpdate);
warehouseRouter.get("/api/warehouses", warehouseList);
warehouseRouter.get("/api/warehouses/:warehouseId", warehouseDetail);
warehouseRouter.delete("/api/warehouses", warehouseDelete);

//product
productRouter.post("/api/products/register", productRegister);
productRouter.patch("/api/products", productUpdate);
productRouter.get("/api/products", productList);
productRouter.get("/api/products/:sku", productDetail);
productRouter.delete("/api/products", productDelete);

//Logistic
logisticRouter.post("/api/logistics/register", logisticRegistert);
logisticRouter.get("/api/logistics", logisticList);
logisticRouter.get("/api/logistics/:logisticCode", logisticDetail);
logisticRouter.patch("/api/logistics", logisticUpdate);
logisticRouter.delete("/api/logistics", logisticDelete);

//stock
stockRouter.post("/api/stocks/register", stockRegister);
stockRouter.get("/api/stocks", stockList);
stockRouter.patch("/api/stocks", stockUpdate);
stockRouter.get("/api/stocks/:stockId", stockDetail);
stockRouter.delete("/api/stocks", stockDelete);

export {
    userRouter,
    companyRouter,
    warehouseRouter,
    productRouter,
    logisticRouter,
    stockRouter,
    userPermissionRouter,
}