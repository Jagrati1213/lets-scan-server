import express from "express";
import {
  logOutUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { authVerify } from "../middlewares/authVerify.middileware";

export const userRouter = express.Router();

// CREATE ROUTER
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", authVerify, logOutUser);
