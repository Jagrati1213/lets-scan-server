import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomRequestT } from "../types";
import { vendorCollection } from "../models/vendor.model";
import { ApiErrors } from "../utils/apiErrors";

export const menuApisHandle = asyncHandler(
  async (req: CustomRequestT, res: Response, next: NextFunction) => {
    // GET CURRENT VENDOR
    const currentVender = await vendorCollection.findById(req.vendor?._id);

    if (!currentVender) {
      return res
        .status(404)
        .json(
          new ApiErrors({ statusCode: 404, statusText: "VENDOR NOT FOUNDED!" })
        );
    }

    // CALLED NEXT WHEN SHOP IS CLOSED
    if (!currentVender.isOpen) {
      next();
    } else {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: "SHOP IS OPENED, CAN'T UPDATE THE MENU",
        })
      );
    }
  }
);
