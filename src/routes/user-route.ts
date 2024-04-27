import express, { Request, Response } from "express";
import { handlerSignUp, handlerSignIn } from "../controllers/auth";

const router = express.Router();

router.post("/signup", handlerSignUp);
router.post("/signin", handlerSignIn);

export { router };
