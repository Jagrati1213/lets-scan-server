import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiErrors } from "../utils/apiErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { venderCollection } from "../models/vender.model";
import { CustomRequestT } from "../types";

export const venderVerify = asyncHandler(
  async (req: CustomRequestT, res: Response, next: NextFunction) => {
    try {
      // GET TOKEN
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      //   CHECK TOKEN EMPTINESS
      if (!token || !process.env.ACCESS_TOKEN_KEY)
        return res.json(
          new ApiErrors({
            statusCode: 401,
            statusText: "UNAUTHORIZED TOKEN!",
          })
        );

      // VERIFY TOKEN
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY
      ) as JwtPayload;

      // GET USER DETAILS
      const verifyVender = await venderCollection
        .findById({ _id: decodedToken?._id })
        .select("-password -refreshToken");

      // CHECK USER'S EXISTENCE
      if (!verifyVender)
        return res.json(
          new ApiErrors({
            statusCode: 401,
            statusText: "INVALID ACCESS TOKEN!",
          })
        );

      req.vender = verifyVender;
      next();
    } catch (error) {
      return res.status(401).json(
        new ApiErrors({
          statusCode: 401,
          statusText: `ERROR IN TOKEN VERIFICATION! ${error}`,
        })
      );
    }
  }
);
