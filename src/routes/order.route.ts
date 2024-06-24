import express from "express";
import { generateOrderIdController } from "../controllers/order/generateOrderId.controller";
import { paymentVerifyController } from "../controllers/order/payment.controller";
import { updateOrderController } from "../controllers/order/updateOrder.controller";

export const orderRouter = express.Router();

//CHECK OUT
orderRouter.post("/checkout", generateOrderIdController);

// PAYMENT VERIFY
orderRouter.post("/payment-verify", paymentVerifyController);

// UPDATE ORDER
orderRouter.post("/", updateOrderController);
