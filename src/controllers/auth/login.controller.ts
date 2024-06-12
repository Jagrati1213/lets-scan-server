import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { userCollection } from "../../models/user.model";
import { generateAccessAndRefreshToken } from "../token/generateToken.controller";
import { ApiResponse } from "../../utils/apiResponse";

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    // GET USER'S DETAILS
    const { username, password } = req.body;

    // CHECK VALIDATION FOR FIELDS
    if (!username || !password) {
      return res.json(
        new ApiErrors({
          statusCode: 401,
          statusText: "ALL FIELDS ARE REQUIRED, TRY AGAIN!",
        })
      );
    }
    // CHECK USER'S EXISTENCE
    const exitsUser = await userCollection.findOne({ username });
    if (!exitsUser || !exitsUser.password)
      return res.json(
        new ApiErrors({ statusCode: 400, statusText: "USER NOT EXITS" })
      );

    // PASSWORD CHECK
    const passwordCorrect = await exitsUser.isPasswordCorrect(password);
    if (!passwordCorrect)
      return res.json(
        new ApiErrors({
          statusCode: 401,
          statusText: "INCORRECT PASSWORD!",
        })
      );
    // CREATE TOKEN
    const tokens = await generateAccessAndRefreshToken(exitsUser._id);
    if (!tokens) return;

    const loggedUser = await userCollection
      .findById(exitsUser?._id)
      .select("-password -refreshToken -createdAt -updatedAt -__v -menuItems");

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
          statusText: "SUCCESSFULLY LOGIN",
          data: loggedUser,
        })
      );
  }
);
