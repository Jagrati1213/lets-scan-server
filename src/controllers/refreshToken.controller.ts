import { NextFunction, Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiErrors } from "../utils/apiErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userCollection } from "../models/user.model";
import { generateAccessAndRefreshToken } from "./user.controller";
import { ApiResponse } from "../utils/apiResponse";

export const refreshToken = asyncHandler(
  async (res: Response, req: Request, next: NextFunction) => {
    // GET TOKEN FROM FRONTEND
    const inComingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    // CHECK TOKEN
    if (!inComingRefreshToken)
      throw new ApiErrors({ statusCode: 401, message: "UNAUTHORIZED TOKEN" });

    // VERIFY TOKEN
    if (!process.env.REFRESH_TOKEN_KEY) return;

    const decodedToken = jwt.verify(
      inComingRefreshToken,
      process.env.REFRESH_TOKEN_KEY
    ) as JwtPayload;

    // GET EXITS USER DETAILS
    const exitsUser = await userCollection.findById(decodedToken._id);
    if (!exitsUser)
      throw new ApiErrors({ statusCode: 400, message: "INVALID TOKEN!" });

    // CHECK TOKENS
    if (inComingRefreshToken !== exitsUser?.refreshToken) {
      throw new ApiErrors({ statusCode: 400, message: "INVALID TOKEN!" });
    }

    // CREATE NEW TOKEN
    const tokens = await generateAccessAndRefreshToken(exitsUser._id);
    if (!tokens) return;

    // AGAIN SET IN COOKIES
    return res
      .status(200)
      .cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json(
        new ApiResponse({
          statusCode: 200,
          message: "TOKEN GENERATED SUCCESSFULLY",
          data: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
        })
      );
  }
);
