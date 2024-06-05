import express from "express";
import { createMenuItem } from "../controllers/menu.controller";
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

menuRouter.get("/", (req, res) => {
  return res.send("hi");
});
