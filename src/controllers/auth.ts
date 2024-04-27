import { userCollection } from "../models/useSchema";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

export const handlerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);

  const user = new userCollection({
    username,
    password: hashPassword,
    email,
  });

  let exitUser = await userCollection.findOne({ username, email });

  try {
    if (exitUser) {
      return res.status(400).json({
        message: "Already exit user",
      });
    } else {
      await user.save();
      return res.status(201).json({
        message: "SuccessFully account created!",
        user: user,
      });
    }
  } catch (error) {
    console.log("Auth Error :", error);
    res.status(500).json({
      message: "Authentication not completed, Internal server error",
    });
  }
};

export const handlerSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    // Check user existence
    let exitUser = await userCollection.findOne({ username });

    if (exitUser?.password && exitUser) {
      const isPassword = bcrypt.compareSync(password, exitUser?.password);
      //   Check password correction
      if (isPassword) {
        return res.status(200).json({
          message: "Successfully login",
          user: exitUser,
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({
        message: "User not founded",
      });
    }
  } catch (error) {
    console.log("Login Error :", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
