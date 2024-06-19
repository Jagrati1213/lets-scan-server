import express from "express";
import { getAllMenuItemsController } from "../controllers/letsScan/getAllMenuItems.controller";
import { getAllVendors } from "../controllers/letsScan/getAllVendors.controller";

export const letScanRouter = express.Router();

letScanRouter.get("/menu-lists/:vendorId", getAllMenuItemsController);
letScanRouter.get("/all-vendors", getAllVendors);
