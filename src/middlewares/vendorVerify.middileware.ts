import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiErrors } from "../utils/apiErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { vendorCollection } from "../models/vendor.model";
import { CustomRequestT } from "../types";

export const vendorVerify = asyncHandler(
  async (req: CustomRequestT, res: Response, next: NextFunction) => {
    try {
      // GET TOKEN
      const token = req.header("Authorization")?.replace("Bearer ", "");

      //   CHECK TOKEN EMPTINESS
      if (!token || !process.env.ACCESS_TOKEN_KEY)
        return res.status(401).json(
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

      // GET VENDOR DETAILS
      const verifyVender = await vendorCollection
        .findById({ _id: decodedToken?._id })
        .select("-password -refreshToken");

      // CHECK VENDOR'S EXISTENCE
      if (!verifyVender)
        return res.status(401).json(
          new ApiErrors({
            statusCode: 401,
            statusText: "INVALID ACCESS TOKEN!",
          })
        );

      req.vendor = verifyVender;
      next();
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN TOKEN VERIFICATION! ${error}`,
        })
      );
    }
  }
);
