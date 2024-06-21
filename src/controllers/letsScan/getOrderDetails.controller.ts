import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";
import mongoose from "mongoose";
import { OrderCollection } from "../../models/order.module";

export const getOrderDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET VENDOR ID
      const { orderId } = req.params;

      // VERIFY ID
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "INVALID ORDER ID",
          })
        );
      }

      // CHECK USER
      const userOrderDeTails = await OrderCollection.findById(orderId).select(
        "-vendorId -createdAt -updatedAt -__v"
      );

      if (!userOrderDeTails) {
        return res.json(
          new ApiErrors({
            statusCode: 404,
            statusText: "USER'S ORDER DETAILS NOT FOUNDED!",
          })
        );
      }
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "ORDERS",
          data: {
            orderDetails: userOrderDeTails,
          },
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN ORDER DETAILS, ${error}`,
        })
      );
    }
  }
);
