import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { venderCollection } from "../../models/vender.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";

export const getAllVendors = asyncHandler(
  async (req: Request, res: Response) => {
    const allRestaurants = await venderCollection
      .find()
      .select(
        "-username -password -email -menuItems -orders -updatedAt -createdAt -refreshToken -__v"
      );
    if (!allRestaurants) {
      return res.json(
        new ApiErrors({
          statusText: "USERS NOT EXISTS!",
          statusCode: 400,
        })
      );
    }
    return res.json(
      new ApiResponse({
        statusCode: 200,
        statusText: "ALL RESTAURANTS",
        data: allRestaurants,
      })
    );
  }
);
