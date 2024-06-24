import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { OrderCollection } from "../../models/order.module";
import { ApiResponse } from "../../utils/apiResponse";

export const updateOrderSuccessController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET CODE
      const { incomingVerifyCode, orderId } = req.body;

      // CHECK IS EMPTY
      if (!incomingVerifyCode) {
        return res.status(404).json(
          new ApiErrors({
            statusCode: 404,
            statusText: "VERIFY CODE IS REQUIRED!",
          })
        );
      }

      //  CHECK VERIFY CODE
      const oldOrder = await OrderCollection.findById(orderId).select(
        "verifyCode"
      );

      if (oldOrder?.verifyCode !== incomingVerifyCode) {
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "VERIFY CODE IS INCORRECT!",
          })
        );
      }

      // SET VERIFY CODE NULL & ORDER STATUS SUCCESS
      const completedOrder = await OrderCollection.findByIdAndUpdate(
        orderId,
        {
          $set: {
            orderStatus: "Complete",
            updatedAt: Date.now(),
          },
        },
        {
          new: true,
        }
      ).select("-createdAt -updatedAt -__v -vendorId");

      if (!completedOrder) {
        return res
          .status(400)
          .json(
            new ApiErrors({ statusCode: 400, statusText: "ORDER NOT UPDATED!" })
          );
      }

      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: "ORDER COMPLETED SUCCESSFULLY!",
          data: completedOrder,
        })
      );
    } catch (error: any) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN UPDATING ORDER STATUS!, ${error?.message}`,
        })
      );
    }
  }
);
