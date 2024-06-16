import express from "express";
import { generateOrderIdController } from "../controllers/order/generateOrderId.controller";
import { paymentController } from "../controllers/order/payment.controller";
import { getRazorKey } from "../controllers/order/getRazorKey.controller";

export const orderRouter = express.Router();

// CREATE ROUTER
orderRouter.post("/checkout", generateOrderIdController);
orderRouter.post("/payment-verify", paymentController);
orderRouter.get("/razor-key", getRazorKey);
