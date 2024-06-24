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
      // GET SKIP & LIMIT
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 5;

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
                  totalAmount: "$orderDetails.totalAmount",
                  payTime: "$orderDetails.createdAt",
                  customerDetails: {
                    name: "$orderDetails.customer.name",
                    orderId: "$orderDetails._id",
                  },
                },
              },
              { $skip: skip },
              { $limit: limit },
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

      return res.status(200).json(
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
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `TRANSITIONS ERROR, ${error?.message}`,
        })
      );
    }
  }
);
