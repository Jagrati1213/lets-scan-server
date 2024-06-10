import express from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuList,
  updateMenuItem,
} from "../controllers/menu.controller";
import { authVerify } from "../middlewares/authVerify.middileware";
import { upload } from "../middlewares/multer.middleware";

export const menuRouter = express.Router();

// MENU ROUTES
menuRouter.post(
  "/create-menu",
  authVerify,
  upload.fields([{ name: "image" }]),
  createMenuItem
);
menuRouter.post(
  "/update-menu",
  authVerify,
  upload.fields([{ name: "image" }]),
  updateMenuItem
);
menuRouter.post("/delete-menu", deleteMenuItem);
menuRouter.get("/", authVerify, getAllMenuList);
