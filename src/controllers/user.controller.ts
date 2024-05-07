import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiErrors } from "../utils/apiErrors";
import { userCollection } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { Types } from "mongoose";
import { CustomRequest } from "../types";

export const generateAccessAndRefreshToken = async (
  userId: Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
  try {
    const user = await userCollection.findOne({ _id: userId });
    if (!user) return;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // SET REFRESH TOKEN IN DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // RETURN TOKEN
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors({ statusCode: 500, message: "CREATED TOKEN ERROR" });
  }
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // GET USER'S DETAILS
    const { username, password, email } = req.body;

    // CHECK VALIDATION FOR FIELDS
    console.log(username);
    if (!username || !email || !password) {
      throw new ApiErrors({ statusCode: 400, message: "ALL FIELDS REQUIRED!" });
    }

    // CHECK USER EXISTENCE WITH USERNAME & EMAIL
    const exitsUser = await userCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (exitsUser) {
      throw new ApiErrors({ statusCode: 403, message: "USER ALREADY EXITS!" });
    }

    // STORE INTO DB & CHECK THE USER CREATED OR NOT
    const newUser = await userCollection.create({
      username: username.toLowerCase(),
      password,
      email,
    });

    // REMOVE PASSWORD AND TOKEN FROM RESPONSE
    const userCreated = await userCollection
      .findById(newUser._id)
      .select("-password -refreshToken");

    if (!userCreated)
      throw new ApiErrors({
        statusCode: 400,
        message: "USER NOT CREATED, PLEASE RE-CREATE ACCOUNT!",
      });

    // RETURN RESPONSE
    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message: "USER CREATED SUCCESSFULLY.",
        data: userCreated,
      })
    );
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // GET USER'S DETAILS
    const { username, password } = req.body;

    // CHECK VALIDATION FOR FIELDS
    if (!username || !password) {
      throw new ApiErrors({
        statusCode: 401,
        message: "CREDENTIALS ARE WRONG, TRY AGAIN!",
      });
    }
    // CHECK USER'S EXISTENCE
    const exitsUser = await userCollection.findOne({ username });
    if (!exitsUser || !exitsUser.password)
      throw new ApiErrors({ statusCode: 400, message: "USER NOT EXITS" });

    // PASSWORD CHECK
    const passwordCorrect = await exitsUser.isPasswordCorrect(password);
    if (!passwordCorrect)
      throw new ApiErrors({ statusCode: 401, message: "INCORRECT PASSWORD!" });

    // CREATE TOKEN
    const tokens = await generateAccessAndRefreshToken(exitsUser._id);
    if (!tokens) return;

    const loggedUser = await userCollection
      .findById(exitsUser?._id)
      .select("-password -refreshToken");

    // SEND IN COOKIES
    return res
      .status(200)
      .cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json(
        new ApiResponse({
          statusCode: 200,
          message: "SUCCESSFULLY LOGIN",
          data: {
            user: loggedUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
        })
      );
  }
);

export const logOutUser = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    await userCollection.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          refreshToken: null,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .clearCookie("accessToken", { httpOnly: true, secure: true })
      .clearCookie("refreshToken", { httpOnly: true, secure: true })
      .json(
        new ApiResponse({
          statusCode: 200,
          message: "LOGOUT SUCCESSFULLY.",
          data: null,
        })
      );
  }
);
