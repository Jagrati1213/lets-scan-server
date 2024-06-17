import express from "express";
import { authVerify } from "../middlewares/authVerify.middileware";
import { upload } from "../middlewares/multer.middleware";
import { uploadImageController } from "../controllers/upload/uploadImage.controller";
import { createMenuItemController } from "../controllers/menu/createMenuItem.controller";
import { updateMenuItemController } from "../controllers/menu/updateMenuItem.controller";
import { deleteMenuItemController } from "../controllers/menu/deleteMenuItem.controller";
import { getMenuListController } from "../controllers/menu/getMenuList.controller";
import { changeFoodActive } from "../controllers/menu/changeFoodActive.controller";
import { menuApisHandle } from "../middlewares/menuApis.middleware";

export const menuRouter = express.Router();

// MENU ROUTES
menuRouter.get("/", authVerify, getMenuListController);
menuRouter.delete(
  "/delete-menu/:menuId",
  authVerify,
  menuApisHandle,
  deleteMenuItemController
);
menuRouter.post(
  "/create-menu",
  authVerify,
  menuApisHandle,
  createMenuItemController
);
menuRouter.put(
  "/update-menu",
  authVerify,
  menuApisHandle,
  updateMenuItemController
);
menuRouter.put("/active", authVerify, changeFoodActive);
menuRouter.post(
  "/upload-image",
  authVerify,
  menuApisHandle,
  upload.fields([{ name: "image" }]),
  uploadImageController
);
