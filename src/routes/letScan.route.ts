import express from "express";
import { getAllMenuItemsController } from "../controllers/letsScan/getAllMenuItems.controller";
import { getAllVendors } from "../controllers/letsScan/getAllVendors.controller";
import { getOrderDetailsController } from "../controllers/letsScan/getOrderDetails.controller";

export const letScanRouter = express.Router();

letScanRouter.get("/menu-lists/:vendorId", getAllMenuItemsController);
letScanRouter.get("/all-vendors", getAllVendors);
letScanRouter.get("/all-orders/:vendorId ", getOrderDetailsController);
