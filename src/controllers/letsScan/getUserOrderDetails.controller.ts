import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { OrderCollection } from "../../models/order.module";
import { vendorCollection } from "../../models/vendor.model";
import { ApiResponse } from "../../utils/apiResponse";
import mongoose from "mongoose";

export const getUserOrderDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET ORDER ID
      const { orderId } = req.params;

      // VERIFY VENDER ID
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "INVALID ORDER ID",
          })
        );
      }

      // CHECK ORDER & GET VENDOR NAME
      const order = await OrderCollection.findById(orderId);

      if (!order) {
        return res.json(
          new ApiErrors({ statusCode: 400, statusText: "ORDER NOT EXISTS!" })
        );
      }

      // RETRIEVE VENDOR RESTAURANT
      const vendor = await vendorCollection.findById(order.vendorId);

      // IF VENDOR DOES NOT EXIST
      if (!vendor) {
        return res.json(
          new ApiErrors({ statusCode: 404, statusText: "VENDOR NOT FOUNDED!" })
        );
      }

      // RESPOND WITH ORDER DETAILS INCLUDING VENDOR RESTAURANT
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "ORDER DETAILS",
          data: { orderDetails: order, restaurant: vendor.restaurant },
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({ statusCode: 400, statusText: "ERROR IN GET DETAILS!" })
      );
    }
  }
);
