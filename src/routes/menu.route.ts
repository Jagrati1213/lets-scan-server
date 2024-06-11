import express from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuList,
  updateMenuItem,
} from "../controllers/menu.controller";
import { authVerify } from "../middlewares/authVerify.middileware";
import { upload } from "../middlewares/multer.middleware";
import { uploadImage } from "../controllers/uploadImage.controller";

export const menuRouter = express.Router();

// MENU ROUTES
menuRouter.post("/create-menu", authVerify, createMenuItem);
menuRouter.post("/update-menu", authVerify, updateMenuItem);

menuRouter.post(
  "/upload-image",
  authVerify,
  upload.fields([{ name: "image" }]),
  uploadImage
);
menuRouter.post("/delete-menu", authVerify, deleteMenuItem);
menuRouter.get("/", authVerify, getAllMenuList);
