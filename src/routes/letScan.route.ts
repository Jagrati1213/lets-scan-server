import express from "express";
import { getAllMenuItemsController } from "../controllers/letsScan/getAllMenuItems.controller";
import { getAllVendors } from "../controllers/letsScan/getAllVendors.controller";
import { getUserOrderDetailsController } from "../controllers/letsScan/getUserOrderDetails.controller";

export const letScanRouter = express.Router();

// GET MENU ITEM DETAILS
letScanRouter.get("/menu-lists/:vendorId", getAllMenuItemsController);

// GET ALL VENDOR
letScanRouter.get("/all-vendors", getAllVendors);

// GET ORDER DETAILS
letScanRouter.get("/order-details/:orderId", getUserOrderDetailsController);
