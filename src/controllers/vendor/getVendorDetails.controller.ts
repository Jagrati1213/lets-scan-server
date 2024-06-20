import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { vendorCollection } from "../../models/vendor.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";
import { CustomRequestT } from "../../types";

export const getVendorDetailsController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      const currentVender = await vendorCollection
        .findById(req.vendor?._id)
        .select(
          "-password -refreshToken -createdAt -updatedAt -__v -menuItems -orders"
        );
      if (!currentVender)
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "VENDOR NOT FOUNDED!",
          })
        );
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "VENDOR EXITS",
          data: currentVender,
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 401,
          statusText: `ERROR IN VENDOR DETAILS, ${error}`,
        })
      );
    }
  }
);
