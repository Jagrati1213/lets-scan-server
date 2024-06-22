import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { paymentCollection } from "../../models/payment.model";
import mongoose from "mongoose";
import { CustomRequestT } from "../../types";
import { ApiResponse } from "../../utils/apiResponse";

export const getAllTransitionsController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      // GET ALL TRANSITIONS
      const result = await paymentCollection.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "orderId",
            foreignField: "_id",
            as: "orderDetails",
          },
        },
        {
          $unwind: "$orderDetails",
        },
        {
          $match: {
            "orderDetails.vendorId": new mongoose.Types.ObjectId(
              req.vendor?._id
            ),
          },
        },
        {
          $facet: {
            transitions: [
              {
                $project: {
                  _id: 1,
                  razorpay_payment_id: 1,
                  orderId: 1,
                  totalAmount: "$orderDetails.totalAmount",
                  payTime: "$orderDetails.createdAt",
                },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);

      const transitions = result[0].transitions;
      const totalCount = result[0].totalCount[0]
        ? result[0].totalCount[0].count
        : 0;

      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "ALL TRANSITIONS",
          data: {
            transitions: transitions,
            totalCount: totalCount,
          },
        })
      );
    } catch (error: any) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: `TRANSITIONS ERROR, ${error?.message}`,
        })
      );
    }
  }
);
