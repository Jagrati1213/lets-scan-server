import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiErrors } from "../utils/apiErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userCollection } from "../models/user.model";
import { CustomRequest } from "../types";

export const authVerify = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      // GET TOKEN
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      //   CHECK TOKEN EMPTINESS
      if (!token || !process.env.ACCESS_TOKEN_KEY)
        throw new ApiErrors({
          statusCode: 401,
          statusText: "UNAUTHORIZED TOKEN!",
        });

      // VERIFY TOKEN
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY
      ) as JwtPayload;

      // GET USER DETAILS
      const verifyUser = await userCollection
        .findById({ _id: decodedToken?._id })
        .select("-password -refreshToken");

      // CHECK USER'S EXISTENCE
      if (!verifyUser)
        throw new ApiErrors({
          statusCode: 401,
          statusText: "INVALID ACCESS TOKEN!",
        });

      req.user = verifyUser;
      next();
    } catch (error) {
      throw new ApiErrors({
        statusCode: 401,
        statusText: `ERROR IN TOKEN VERIFICATION! ${error}`,
      });
    }
  }
);
