import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CustomRequestT } from "../../types";
import { vendorCollection } from "../../models/vendor.model";
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
        .select("-createdAt -updatedAt -__v -vendorId -verifyCode");

      const totalOrder = await OrderCollection.countDocuments({
        vendorId: req.vendor?._id,
        orderStatus: type,
      });

      // SEND TO CLIENT
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: `ORDERS, ${type}`,
          data: { orders, totalOrder },
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 404,
          statusText: `ERROR IN ORDERS, ${error}`,
        })
      );
    }
  }
);
