import express from "express";
import { vendorVerify } from "../middlewares/vendorVerify.middileware";
import { registerController } from "../controllers/auth/register.controller";
import { loginController } from "../controllers/auth/login.controller";
import { logOutController } from "../controllers/auth/logout.controller";
import { refreshTokenController } from "../controllers/token/refreshToken.controller";
import { getUserDetailsController } from "../controllers/user/getUserDetails.controller";
import { updateIsOpenController } from "../controllers/user/updateIsOpen.controller";

export const vendorRouter = express.Router();

// CREATE ROUTER
vendorRouter.post("/register", registerController);
vendorRouter.post("/login", loginController);
vendorRouter.get("/logout", vendorVerify, logOutController);
vendorRouter.get("/refresh-token", refreshTokenController);
vendorRouter.get("/", vendorVerify, getUserDetailsController);
vendorRouter.put("/open-shop", vendorVerify, updateIsOpenController);
