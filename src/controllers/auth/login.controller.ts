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
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "ALL FIELDS ARE REQUIRED!",
          })
        );
      }

      // CHECK CURRENT VENDER
      const currentVender = await vendorCollection.findOne({ username });
      if (!currentVender)
        return res.status(404).json(
          new ApiErrors({
            statusCode: 404,
            statusText: "VENDOR NOT FOUNDED!",
          })
        );

      // PASSWORD CHECK
      const passwordCorrect = await currentVender.isPasswordCorrect(password);
      if (!passwordCorrect)
        return res.status(401).json(
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

      // SEND DATA & TOKENS
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: "SUCCESSFULLY LOGIN",
          data: {
            vendor: {
              ...loggedVender?.toObject(),
              totalCustomers: 0,
              totalOrders: 0,
              totalRevenue: 0,
              bestSell: "No best selling item",
            },
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `LOGIN IS NOT COMPLETED, ${error}`,
        })
      );
    }
  }
);
