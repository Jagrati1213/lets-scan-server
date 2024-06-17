import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomRequest } from "../types";
import { userCollection } from "../models/user.model";
import { ApiErrors } from "../utils/apiErrors";

export const menuApisHandle = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // GET CURRENT USER
    const currentUser = await userCollection.findById(req.user?._id);

    if (!currentUser) {
      return res.json(
        new ApiErrors({ statusCode: 404, statusText: "USER NOT FOUNDED!" })
      );
    }

    // CALLED NEXT WHEN SHOP IS OPEN
    if (!currentUser.isOpen) {
      next();
    } else {
      return res.json(
        new ApiErrors({
          statusCode: 403,
          statusText: "SHOP IS OPENED, CAN'T UPDATE THE MENU",
        })
      );
    }
  }
);
