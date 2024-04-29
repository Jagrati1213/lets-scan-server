import { userCollection } from "../models/useSchema";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  try {
    let exitUser = await userCollection.findOne({
      $or: [{ username }, { email }],
    });
    if (exitUser) {
      return res.json({
        message: "Already exit user",
        status: 400,
      });
    } else {
      await user.save();
      return res.json({
        message: "SuccessFully account created!",
        user: user,
        status: 201,
      });
    }
  } catch (error) {
    console.log("Auth Error :", error);
    res.json({
      message: `Authentication not completed, ${error}`,
      status: 500,
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

      //   Check password correction & secret key
      if (isPassword && process.env.SECRET_KEY) {
        // Generate token
        const token = jwt.sign({ _id: exitUser?._id }, process.env.SECRET_KEY, {
          expiresIn: "86400000", //1day
        });
        res.cookie(String(exitUser._id), token, {
          path: "/",
          expires: new Date(Date.now() + 30 * 60 * 1000), //expire in 30 minutes
          httpOnly: true, //not accessible from frontend
          sameSite: "lax",
        });
        return res.json({
          message: "Successfully login",
          user: exitUser,
          status: 200,
        });
      } else {
        return res.json({
          message: "Invalid Password",
          status: 400,
        });
      }
    } else {
      return res.json({
        message: "User not founded",
        status: 400,
      });
    }
  } catch (error) {
    console.log("Login Error :", error);
    res.json({
      message: "Internal server error",
      status: 500,
    });
  }
};
