import express from "express";
import { getMenuItemsController } from "../controllers/website/getMenuItems.controller";

export const menuWebsiteRouter = express.Router();

menuWebsiteRouter.get("/:userId", getMenuItemsController);
