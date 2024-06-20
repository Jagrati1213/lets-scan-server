import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { vendorCollection } from "../../models/vendor.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";

export const getAllVendors = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const allRestaurants = await vendorCollection
        .find()
        .select(
          "-username -password -email -menuItems -orders -updatedAt -createdAt -refreshToken -__v"
        );
      if (!allRestaurants) {
        return res.json(
          new ApiErrors({
            statusText: "Vendor NOT EXISTS!",
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
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 401,
          statusText: `ALL RESTAURANT ERROR, ${error}`,
        })
      );
    }
  }
);
