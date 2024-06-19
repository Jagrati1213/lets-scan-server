import express from "express";
import { venderVerify } from "../middlewares/venderVerify.middileware";
import { registerController } from "../controllers/auth/register.controller";
import { loginController } from "../controllers/auth/login.controller";
import { logOutController } from "../controllers/auth/logout.controller";
import { refreshTokenController } from "../controllers/token/refreshToken.controller";
import { getUserDetailsController } from "../controllers/user/getUserDetails.controller";
import { updateIsOpenController } from "../controllers/user/updateIsOpen.controller";

export const venderRouter = express.Router();

// CREATE ROUTER
venderRouter.post("/register", registerController);
venderRouter.post("/login", loginController);
venderRouter.get("/logout", venderVerify, logOutController);
venderRouter.get("/refresh-token", refreshTokenController);
venderRouter.get("/", venderVerify, getUserDetailsController);
venderRouter.put("/open-shop", venderVerify, updateIsOpenController);
