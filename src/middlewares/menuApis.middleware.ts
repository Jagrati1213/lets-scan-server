import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomRequestT } from "../types";
import { vendorCollection } from "../models/vendor.model";
import { ApiErrors } from "../utils/apiErrors";

export const menuApisHandle = asyncHandler(
  async (req: CustomRequestT, res: Response, next: NextFunction) => {
    // GET CURRENT USER
    const currentVender = await vendorCollection.findById(req.vendor?._id);

    if (!currentVender) {
      return res.json(
        new ApiErrors({ statusCode: 404, statusText: "USER NOT FOUNDED!" })
      );
    }

    // CALLED NEXT WHEN SHOP IS OPEN
    if (!currentVender.isOpen) {
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
