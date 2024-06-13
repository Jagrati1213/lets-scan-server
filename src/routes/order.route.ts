import express from "express";
import { orderPlacedController } from "../controllers/order/orderPlaced.controller";

export const orderRouter = express.Router();

// CREATE ROUTER
orderRouter.get("/", (req, res) => {
  res.send("hi");
});

orderRouter.post("/:userId", orderPlacedController);
