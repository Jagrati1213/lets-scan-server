import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { vendorCollection } from "../../models/vendor.model";
import { generateAccessAndRefreshToken } from "../token/generateToken.controller";
import { ApiResponse } from "../../utils/apiResponse";

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET VENDOR'S DETAILS
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

      // CHECK CURRENT VENDER
      const currentVender = await vendorCollection.findOne({ username });
      if (!currentVender)
        return res.json(
          new ApiErrors({ statusCode: 400, statusText: "VENDOR NOT EXITS" })
        );

      // PASSWORD CHECK
      const passwordCorrect = await currentVender.isPasswordCorrect(password);
      if (!passwordCorrect)
        return res.json(
          new ApiErrors({
            statusCode: 401,
            statusText: "INCORRECT PASSWORD!",
          })
        );
      // CREATE TOKEN
      const tokens = await generateAccessAndRefreshToken(currentVender._id);
      if (!tokens) return;

      const loggedVender = await vendorCollection
        .findById(currentVender?._id)
        .select(
          "-password -refreshToken -createdAt -updatedAt -__v -menuItems -orders"
        );

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
            data: loggedVender,
          })
        );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: `LOGIN IS NOT COMPLETED, ${error}`,
        })
      );
    }
  }
);
