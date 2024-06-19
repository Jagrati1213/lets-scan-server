import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiErrors } from "../../utils/apiErrors";

export const getRazorKey = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!process.env.RAZOR_API_KEY_ID) {
      return res.json(
        new ApiErrors({
          statusCode: 401,
          statusText: "RAZOR KEY IS NOT FOUNDED!",
        })
      );
    }
    return res.json(
      new ApiResponse({
        statusCode: 200,
        statusText: "RAZOR KEY",
        data: {
          key: process.env.RAZOR_API_KEY_ID,
        },
      })
    );
  } catch (error) {
    return res.json(
      new ApiErrors({
        statusCode: 401,
        statusText: "RAZOR KEY IS NOT FOUNDED!",
      })
    );
  }
});
