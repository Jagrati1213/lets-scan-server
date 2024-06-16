import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";

export const getRazorKey = asyncHandler(async (req: Request, res: Response) => {
  if (!process.env.RAZOR_API_KEY_ID) return;
  return res.json(
    new ApiResponse({
      statusCode: 200,
      statusText: "RAZOR KEY",
      data: {
        key: process.env.RAZOR_API_KEY_ID,
      },
    })
  );
});
