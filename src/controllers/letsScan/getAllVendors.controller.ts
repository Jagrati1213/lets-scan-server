import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { vendorCollection } from "../../models/vendor.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";

export const getAllVendors = asyncHandler(async (_: Request, res: Response) => {
  try {
    const allRestaurants = await vendorCollection
      .find()
      .select(
        "-username -password -email -menuItems -orders -updatedAt -createdAt -refreshToken -__v"
      );
    if (!allRestaurants) {
      return res.status(404).json(
        new ApiErrors({
          statusText: "Vendor NOT FOUNDED!",
          statusCode: 404,
        })
      );
    }
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        statusText: "ALL RESTAURANTS",
        data: allRestaurants,
      })
    );
  } catch (error) {
    return res.status(400).json(
      new ApiErrors({
        statusCode: 400,
        statusText: `ALL RESTAURANT ERROR, ${error}`,
      })
    );
  }
});
