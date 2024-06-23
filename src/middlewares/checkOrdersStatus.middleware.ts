import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { vendorCollection } from "../models/vendor.model";
import { CustomRequestT } from "../types";
import { ApiErrors } from "../utils/apiErrors";

export const checkOrdersStatus = asyncHandler(
  async (req: CustomRequestT, res: Response, next: NextFunction) => {
    try {
      //  CHECK ORDER STATUS
      const currentVendorPendingOrders = await vendorCollection
        .findById(req?.vendor?._id)
        .populate({
          path: "orders",
          match: { orderStatus: "Pending" },
        });

      if (currentVendorPendingOrders) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "SHOP CAN'T CLOSED! ORDERS ARE PENDING!",
          })
        );
      } else {
        next();
      }
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "ERROR IN CHECK ORDER STATUS",
        })
      );
    }
  }
);
