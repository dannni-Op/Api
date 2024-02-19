import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error.middleware.js";
import { companyRouter, logisticRouter, materialRouter, productRouter, stockRouter, userPermissionRouter, userRouter, warehouseRouter } from "../route/api.js";
import cors from "cors";

export const app = express();
app.use(express.json());
app.use(publicRouter);
app.use(userRouter);
app.use(companyRouter);
app.use(warehouseRouter);
app.use(productRouter);
app.use(logisticRouter);
app.use(stockRouter);
app.use(userPermissionRouter);
app.use(materialRouter);
app.use(errorMiddleware);
