import express from "express";
import { getAllMenuItemsController } from "../controllers/letsScan/getAllMenuItems.controller";
import { getAllRestaurant } from "../controllers/letsScan/getAllRasturants.controller";

export const letScanRouter = express.Router();

letScanRouter.post("/menu-lists", getAllMenuItemsController);
letScanRouter.get("/all-venders", getAllRestaurant);
