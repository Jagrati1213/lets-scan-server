import { Response } from "express";
import { OrderCollection } from "../../models/order.module";
import { CustomRequestT } from "../../types";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

// GET MONTH
const getMonthString = (date: Date) => {
  return date.getMonth() + 1;
};

export const getOrdersGraphController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      const { startDate } = req.query;
      if (!startDate || typeof startDate !== "string") {
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "MISSING DATE",
          })
        );
      }

      // SET START & END DATE
      const end = new Date(startDate);
      const start = new Date(end.getFullYear(), 0, 1); // CURRENT YEAR

      const result: {
        month: number;
        totalOrders: number;
        totalAmount: number;
      }[] = [];

      const orders = await OrderCollection.find({
        vendorId: req.vendor?._id,
        createdAt: {
          $gte: start,
          $lt: end,
        },
      });

      // CONVERT AGGREGATE DATA TO ARRAY FORMAT
      orders.forEach((order) => {
        const month = getMonthString(order.createdAt);
        const index = result.findIndex((item) => item.month === month);
        if (index === -1) {
          result.push({
            month: month,
            totalOrders: 1,
            totalAmount: order.totalAmount || 0,
          });
        } else {
          result[index].totalOrders += 1;
          result[index].totalAmount += order.totalAmount || 0;
        }
      });

      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: "SUCCESSFULLY GET DATA",
          data: result,
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN ORDERS GRAPH, ${error?.message}`,
        })
      );
    }
  }
);
