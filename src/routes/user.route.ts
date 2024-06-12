import express from "express";
import { authVerify } from "../middlewares/authVerify.middileware";
import { registerController } from "../controllers/auth/register.controller";
import { loginController } from "../controllers/auth/login.controller";
import { logOutController } from "../controllers/auth/logout.controller";
import { refreshTokenController } from "../controllers/token/refreshToken.controller";
import { getUserDetailsController } from "../controllers/user/getUserDetails.controller";

export const userRouter = express.Router();

// CREATE ROUTER
userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/logout", authVerify, logOutController);
userRouter.post("/refresh-token", refreshTokenController);
userRouter.get("/", authVerify, getUserDetailsController);
