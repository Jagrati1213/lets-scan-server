import { Response } from "express";
import { CustomRequest } from "../../types";
import { asyncHandler } from "../../utils/asyncHandler";
import { userCollection } from "../../models/user.model";
import { ApiResponse } from "../../utils/apiResponse";

export const logOutController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
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
          statusText: "LOGOUT SUCCESSFULLY.",
          data: null,
        })
      );
  }
);
