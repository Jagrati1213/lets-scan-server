import { Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { vendorCollection } from "../../models/vendor.model";
import { generateAccessAndRefreshToken } from "./generateToken.controller";
import { ApiResponse } from "../../utils/apiResponse";

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET TOKEN FROM FRONTEND
      const inComingRefreshToken = req.cookies?.refreshToken;

      // CHECK TOKEN
      if (!inComingRefreshToken)
        return res.json(
          new ApiErrors({
            statusCode: 401,
            statusText: "UNAUTHORIZED USER",
          })
        );

      // VERIFY TOKEN
      if (!process.env.REFRESH_TOKEN_KEY) return;

      const decodedToken = jwt.verify(
        inComingRefreshToken,
        process.env.REFRESH_TOKEN_KEY
      ) as JwtPayload;

      // GET EXITS USER DETAILS
      const currentVender = await vendorCollection.findById(decodedToken._id);
      if (!currentVender)
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "USER NOT FOUND!",
          })
        );

      // CHECK TOKENS
      if (inComingRefreshToken !== currentVender?.refreshToken) {
        return res.json(
          new ApiErrors({ statusCode: 400, statusText: "INVALID TOKEN!" })
        );
      }

      // CREATE NEW TOKEN
      const tokens = await generateAccessAndRefreshToken(currentVender._id);
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
            statusText: "TOKEN GENERATED SUCCESSFULLY",
            data: null,
          })
        );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "ERROR IN REFRESH TOKEN!",
        })
      );
    }
  }
);
