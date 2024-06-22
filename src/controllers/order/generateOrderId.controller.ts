import Razorpay from "razorpay";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import mongoose from "mongoose";
import { vendorCollection } from "../../models/vendor.model";

export const generateOrderIdController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET TOTAL AMOUNT
      const { amount, vendorId } = req.body;

      const currentVendor = await vendorCollection.findById(vendorId);

      // RETURN IF VENDOR ID NOT EXIST
      if (!mongoose.Types.ObjectId.isValid(vendorId) || !currentVendor) {
        return res.json(
          new ApiErrors({
            statusCode: 404,
            statusText: "INVALID VENDOR ID",
          })
        );
      }

      if (!amount) {
        return res.json(
          new ApiErrors({
            statusText: "TOTAL AMOUNT IS MISSING!",
            statusCode: 404,
          })
        );
      }
      // CHECK ENV VALUES
      if (!process.env.RAZOR_API_KEY_ID || !process.env.RAZOR_API_KEY_SECRET)
        return;

      //   CREATE INSTANCE FOR RAZOR PAY
      const razorPayInstance = new Razorpay({
        key_id: process.env.RAZOR_API_KEY_ID,
        key_secret: process.env.RAZOR_API_KEY_SECRET,
      });

      // TODO: CHANGE RECEIPT
      //   GET ORDERS DETAILS FROM CLIENT
      const options = {
        amount: Number(amount * 100),
        currency: "INR",
        receipt: "Let's Scan",
        payment_capture: 1,
      };

      // GENERATE ORDER
      const order = await razorPayInstance.orders.create(options);

      if (!order) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "ORDER NOT CREATED BY RAZOR PAY",
          })
        );
      }

      // RETURN ORDER DATA TO CLIENT
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "RAZOR ORDER DETAILS",
          data: {
            order,
          },
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusText: "ERROR IN RAZOR ORDER CREATION!",
          statusCode: 500,
        })
      );
    }
  }
);
