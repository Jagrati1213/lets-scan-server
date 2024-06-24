import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CustomRequestT } from "../../types";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";
import { OrderCollection } from "../../models/order.module";

export const getAllOrdersController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      // GET SEARCH QUERY
      const type = req.query.type || "Placed";
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 5;

      // FILTER OUT THE ORDERS
      const orders = await OrderCollection.find({
        vendorId: req.vendor?._id,
        orderStatus: type,
      })
        .skip(skip)
        .limit(limit)
        .select("-createdAt -updatedAt -__v -vendorId -verifyCode")
        .populate("orderList.menuId", "name");

      const totalOrder = await OrderCollection.countDocuments({
        vendorId: req.vendor?._id,
        orderStatus: type,
      });

      // SEND TO CLIENT
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: `ORDERS, ${type}`,
          data: { orders, totalOrder },
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN ORDERS, ${error}`,
        })
      );
    }
  }
);
