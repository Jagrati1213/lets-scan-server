import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { venderCollection } from "../../models/vender.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";
import { CustomRequestT } from "../../types";

export const getUserDetailsController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    const currentVender = await venderCollection
      .findById(req.vender?._id)
      .select(
        "-password -refreshToken -createdAt -updatedAt -__v -menuItems -orders"
      );
    if (!currentVender)
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
        data: currentVender,
      })
    );
  }
);
