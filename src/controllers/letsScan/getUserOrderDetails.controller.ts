import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { OrderCollection } from "../../models/order.module";
import { vendorCollection } from "../../models/vendor.model";
import { ApiResponse } from "../../utils/apiResponse";
import mongoose from "mongoose";
import { menuCollection } from "../../models/menu.model";

export const getUserOrderDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET ORDER ID
      const { orderId } = req.params;

      // VERIFY VENDER ID
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "INVALID ORDER ID",
          })
        );
      }

      // CHECK ORDER & GET VENDOR NAME
      const order = await OrderCollection.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json(
            new ApiErrors({ statusCode: 400, statusText: "ORDER NOT FOUNDED!" })
          );
      }

      // GET MENU NAME
      const menuIds = order.orderList.map((item) => item.menuId);
      const menuDetails = await menuCollection
        .find({ _id: { $in: menuIds } })
        .lean();

      const updatedOrderList = order.orderList.map((item) => {
        const menu = menuDetails.find((menu) => menu._id.equals(item.menuId));
        return {
          ...item.toObject(),
          name: menu ? menu.name : "Unknown",
        };
      });

      // RETRIEVE VENDOR RESTAURANT
      const vendor = await vendorCollection.findById(order.vendorId);

      // IF VENDOR DOES NOT EXIST
      if (!vendor) {
        return res.status(404).json(
          new ApiErrors({
            statusCode: 404,
            statusText: "VENDOR NOT FOUNDED!",
          })
        );
      }

      // RESPOND WITH ORDER DETAILS INCLUDING VENDOR RESTAURANT
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: "ORDER DETAILS",
          data: {
            orderDetails: { ...order.toObject(), orderList: updatedOrderList },
            restaurant: vendor.restaurant,
          },
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: "ERROR IN GET DETAILS!",
        })
      );
    }
  }
);
