import { Response } from "express";
import { CustomRequestT } from "../../types";
import { asyncHandler } from "../../utils/asyncHandler";
import { vendorCollection } from "../../models/vendor.model";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiErrors } from "../../utils/apiErrors";

export const logOutController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      await vendorCollection.findByIdAndUpdate(
        req.vendor?._id,
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
            statusText: "LOGOUT SUCCESSFULLY.",
            data: null,
          })
        );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 401,
          statusText: "SOMETHING PROBLEM IN LOGOUT!",
        })
      );
    }
  }
);
