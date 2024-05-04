import express from "express";
import { registerUser } from "../controllers/user.controller";

export const userRouter = express.Router();

// CREATE ROUTER
userRouter.post("/register", registerUser);
