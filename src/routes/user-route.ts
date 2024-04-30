import express, { Request, Response } from "express";
import { handlerSignUp, handlerSignIn } from "../controllers/auth";
import { handleVerifyToken } from "../controllers/verifyToken";
import { handleGetUserDetails } from "../controllers/getUserDetails";
import { handleRefreshToken } from "../controllers/refreshToken";

const router = express.Router();

router.post("/signup", handlerSignUp);
router.post("/signin", handlerSignIn);
router.get("/user", handleVerifyToken, handleGetUserDetails);
router.get(
  "/refresh",
  handleRefreshToken,
  handleVerifyToken,
  handleGetUserDetails
);

export { router };
