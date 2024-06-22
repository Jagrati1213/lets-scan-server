import express from "express";
import { generateOrderIdController } from "../controllers/order/generateOrderId.controller";
import { paymentVerifyController } from "../controllers/order/payment.controller";
import { updateOrderController } from "../controllers/order/updateOrder.controller";

export const orderRouter = express.Router();

// CREATE ROUTER
orderRouter.post("/checkout", generateOrderIdController);
orderRouter.post("/payment-verify", paymentVerifyController);
orderRouter.post("/", updateOrderController);
