import express from "express";
import {
  createMenuItem,
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
menuRouter.get("/", authVerify, getAllMenuList);
