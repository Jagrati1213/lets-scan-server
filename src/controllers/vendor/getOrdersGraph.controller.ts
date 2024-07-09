import { Response } from "express";
import { OrderCollection } from "../../models/order.module";
import { CustomRequestT } from "../../types";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

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
      const start = new Date(end);
      start.setDate(start.getDate() - 6); //PAST 7 DAYS

      const result: {
        date: string;
        totalOrders: number;
        totalAmount: number;
      }[] = [];
      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        result.push({
          date: dateString,
          totalOrders: 0,
          totalAmount: 0,
        });
      }

      const orders = await OrderCollection.find({
        vendorId: req.vendor?._id,
        createdAt: {
          $gte: start,
          $lt: end,
        },
      });

      // CONVERT AGGREGATE DATA TO ARRAY FORMAT
      orders.forEach((order) => {
        const date = order.createdAt.toISOString().split("T")[0];
        const index = result.findIndex((item) => item.date === date);
        if (index !== -1 && order.totalAmount) {
          result[index].totalOrders += 1;
          result[index].totalAmount += order.totalAmount;
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
