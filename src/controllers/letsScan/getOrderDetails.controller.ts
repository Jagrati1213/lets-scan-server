import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";
import { vendorCollection } from "../../models/vendor.model";
import mongoose from "mongoose";

export const getOrderDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET VENDOR ID
      const { vendorId } = req.params;

      // VERIFY ID
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "INVALID VENDOR ID",
          })
        );
      }

      // CHECK USER
      const currentVendor = await vendorCollection.findById(vendorId).populate({
        path: "orders",
        select: "-paymentId -vendorId -createdAt -updatedAt -__v",
      });

      if (!currentVendor) {
        return res.json(
          new ApiErrors({
            statusCode: 404,
            statusText: "VENDOR NOT FOUNDED!",
          })
        );
      }
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "ALL ORDERS LIST",
          data: {
            orders: currentVendor.orders,
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
