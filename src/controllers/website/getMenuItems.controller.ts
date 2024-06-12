import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiErrors } from "../../utils/apiErrors";
import { userCollection } from "../../models/user.model";
import mongoose from "mongoose";

export const getMenuItemsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    // Validate USER ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "Invalid user ID",
        })
      );
    }

    // CHECK USER
    const currentUser = await userCollection
      .findById(userId)
      .select("-password -createdAt -updatedAt -__v -refreshToken");

    if (!currentUser) {
      return res.json(
        new ApiErrors({
          statusCode: 404,
          statusText: "USER NOT FOUNDED!",
        })
      );
    }
    return res.json(
      new ApiResponse({
        statusCode: 200,
        statusText: "MENU LISTS",
        data: currentUser.menuItems,
      })
    );
  }
);
