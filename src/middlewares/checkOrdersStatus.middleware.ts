import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomRequestT } from "../types";
import { ApiErrors } from "../utils/apiErrors";
import { OrderCollection } from "../models/order.module";

export const checkOrdersStatus = asyncHandler(
  async (req: CustomRequestT, res: Response, next: NextFunction) => {
    try {
      //  CHECK ORDER STATUS
      const currentVendorPendingOrders = await OrderCollection.exists({
        vendorId: req.vendor?._id,
        orderStatus: "Pending",
      });
      if (currentVendorPendingOrders) {
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "SHOP CAN'T CLOSED! ORDERS ARE PENDING!",
          })
        );
      } else {
        next();
      }
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: "ERROR IN CHECK ORDER STATUS",
        })
      );
    }
  }
);
