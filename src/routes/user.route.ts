import express from "express";
import {
  logOutUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { authVerify } from "../middlewares/authVerify.middileware";
import { refreshTokenCreate } from "../controllers/refreshToken.controller";

export const userRouter = express.Router();

// CREATE ROUTER
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", authVerify, logOutUser);
userRouter.post("/refresh-token", refreshTokenCreate);
