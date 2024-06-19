import express from "express";
import { venderVerify } from "../middlewares/venderVerify.middileware";
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
menuRouter.get("/", venderVerify, getMenuListController);
menuRouter.delete(
  "/delete-menu/:menuId",
  venderVerify,
  menuApisHandle,
  deleteMenuItemController
);
menuRouter.post(
  "/create-menu",
  venderVerify,
  menuApisHandle,
  createMenuItemController
);
menuRouter.put(
  "/update-menu",
  venderVerify,
  menuApisHandle,
  updateMenuItemController
);
menuRouter.put("/active", venderVerify, changeFoodActive);
menuRouter.post(
  "/upload-image",
  venderVerify,
  menuApisHandle,
  upload.fields([{ name: "image" }]),
  uploadImageController
);
