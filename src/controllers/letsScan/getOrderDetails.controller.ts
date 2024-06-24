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
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "INVALID ORDER ID",
          })
        );
      }

      // CHECK USER
      const vendorOrderDetails = await OrderCollection.findById(orderId).select(
        "-vendorId -createdAt -updatedAt -__v"
      );

      if (!vendorOrderDetails) {
        return res.status(404).json(
          new ApiErrors({
            statusCode: 404,
            statusText: "VENDOR'S ORDER DETAILS NOT FOUNDED!",
          })
        );
      }
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: "ORDERS",
          data: {
            orderDetails: vendorOrderDetails,
          },
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN ORDER DETAILS, ${error}`,
        })
      );
    }
  }
);
