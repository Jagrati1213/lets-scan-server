import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { userCollection } from "../../models/user.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";
import { CustomRequest } from "../../types";

export const getUserDetailsController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const exitsUser = await userCollection
      .findById(req.user?._id)
      .select("-password -refreshToken -createdAt -updatedAt -__v -menuItems");
    if (!exitsUser)
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "USER NOT FOUNDED!",
        })
      );
    return res.json(
      new ApiResponse({
        statusCode: 200,
        statusText: "USER EXITS",
        data: exitsUser,
      })
    );
  }
);
