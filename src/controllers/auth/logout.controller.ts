import { Response } from "express";
import { CustomRequestT } from "../../types";
import { asyncHandler } from "../../utils/asyncHandler";
import { venderCollection } from "../../models/vender.model";
import { ApiResponse } from "../../utils/apiResponse";

export const logOutController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    await venderCollection.findByIdAndUpdate(
      req.vender?._id,
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
  }
);
