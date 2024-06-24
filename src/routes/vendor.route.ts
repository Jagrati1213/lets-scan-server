import express from "express";
import { vendorVerify } from "../middlewares/vendorVerify.middileware";
import { registerController } from "../controllers/auth/register.controller";
import { loginController } from "../controllers/auth/login.controller";
import { logOutController } from "../controllers/auth/logout.controller";
import { refreshTokenController } from "../controllers/token/refreshToken.controller";
import { getVendorDetailsController } from "../controllers/vendor/getVendorDetails.controller";
import { updateIsOpenController } from "../controllers/vendor/updateIsOpen.controller";
import { getAllOrdersController } from "../controllers/vendorOrder/getAllOrders.controller";
import { updateOrderSuccessController } from "../controllers/vendorOrder/updateOrderSuccess.controller";
import { getAllTransitionsController } from "../controllers/transitions/getAllTransitions.controller";
import { checkOrdersStatus } from "../middlewares/checkOrdersStatus.middleware";

export const vendorRouter = express.Router();

// REGISTER USER
vendorRouter.post("/register", registerController);

// LOGIN
vendorRouter.post("/login", loginController);

// LOGOUT
vendorRouter.get("/logout", vendorVerify, logOutController);

// REFRESH_TOKEN
vendorRouter.get("/refresh-token", refreshTokenController);

// GET VENDOR
vendorRouter.get("/", vendorVerify, getVendorDetailsController);

// OPEN _CLOSE SHOP
vendorRouter.put(
  "/open-shop",
  vendorVerify,
  checkOrdersStatus,
  updateIsOpenController
);

// GET ORDERS
vendorRouter.get("/order", vendorVerify, getAllOrdersController);

// UPDATE ORDERS
vendorRouter.put("/order/verify", vendorVerify, updateOrderSuccessController);

// GET TRANSITIONS
vendorRouter.get("/transitions", vendorVerify, getAllTransitionsController);
