import {detail, list, update} from "../controller/user.constroller.js";
import {register as companyRegister, update as companyUpdate, list as companyList, detail as companyDetail} from "../controller/company.controller.js";
import {register as warehouseRegister, update as warehouseUpdate, list as warehouseList, detail as warehouseDetail, deleteWarehouse as warehouseDelete} from "../controller/warehouse.controller.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {register as productRegister, update as productUpdate, list as productList, detail as productDetail, deleteProduct as productDelete } from "../controller/product.controller.js";

const userRouter = new express.Router();
const companyRouter = new express.Router();
const warehouseRouter = new express.Router();
const productRouter = new express.Router();

userRouter.use(authMiddleware);
companyRouter.use(authMiddleware);
warehouseRouter.use(authMiddleware);
productRouter.use(authMiddleware);

//user
userRouter.patch("/api/users", update);
userRouter.get("/api/users", list);
userRouter.get("/api/users/:userId", detail);

//company
companyRouter.post("/api/companies/register", companyRegister);
companyRouter.patch("/api/companies", companyUpdate);
companyRouter.get("/api/companies", companyList);
companyRouter.get("/api/companies/:companyId", companyDetail);

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

export {
    userRouter,
    companyRouter,
    warehouseRouter,
    productRouter,
}