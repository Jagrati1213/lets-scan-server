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
      const inComingRefreshToken = req
        .header("Authorization")
        ?.replace("Bearer ", "");

      // CHECK TOKEN
      if (!inComingRefreshToken)
        return res.status(401).json(
          new ApiErrors({
            statusCode: 401,
            statusText: "UNAUTHORIZED VENDOR",
          })
        );

      // VERIFY TOKEN
      if (!process.env.REFRESH_TOKEN_KEY) return;

      const decodedToken = jwt.verify(
        inComingRefreshToken,
        process.env.REFRESH_TOKEN_KEY
      ) as JwtPayload;

      // GET EXITS VENDOR DETAILS
      const currentVender = await vendorCollection.findById(decodedToken._id);
      if (!currentVender)
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "VENDOR NOT FOUND!",
          })
        );

      // CHECK TOKENS
      if (inComingRefreshToken !== currentVender?.refreshToken) {
        return res
          .status(400)
          .json(
            new ApiErrors({ statusCode: 400, statusText: "INVALID TOKEN!" })
          );
      }

      // CREATE NEW TOKEN
      const tokens = await generateAccessAndRefreshToken(currentVender._id);
      if (!tokens) return;

      // SEND TOKENS
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: "TOKENS  GENERATED SUCCESSFULLY",
          data: {
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN REFRESH TOKEN!, ${error}`,
        })
      );
    }
  }
);
