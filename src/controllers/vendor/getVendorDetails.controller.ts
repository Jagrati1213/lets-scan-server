import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { vendorCollection } from "../../models/vendor.model";
import { OrderCollection } from "../../models/order.module";
import { menuCollection } from "../../models/menu.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";
import { CustomRequestT } from "../../types";
import mongoose from "mongoose";

export const getVendorDetailsController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      let totalRevenue: number = 0;
      let totalOrders: number = 0;
      let totalCustomers: number = 0;
      let item: string | null | undefined = "unKnown";

      // CHECK VENDOR
      const currentVendor = await vendorCollection
        .findById(req.vendor?._id)
        .select(
          "-password -refreshToken -createdAt -updatedAt -__v -menuItems -orders"
        );

      if (!currentVendor)
        return res.status(404).json(
          new ApiErrors({
            statusCode: 404,
            statusText: "VENDOR NOT FOUNDED!",
          })
        );

      // GET ORDERS
      const orders = await OrderCollection.find({
        vendorId: currentVendor?._id,
      });

      // IF ORDER HAVE
      if (orders) {
        // CALCULATE ORDERS
        totalOrders = orders.length;

        // CALCULATE REVENUE
        totalRevenue = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        // CALCULATE UNIQUE CUSTOMERS
        const uniqueCustomerEmails = new Set();
        orders.forEach((order) =>
          uniqueCustomerEmails.add(order?.customer?.email)
        );
        totalCustomers = uniqueCustomerEmails.size;
      }

      // CALCULATE BEST SELLING ITEM
      const bestSellingItem = await OrderCollection.aggregate([
        {
          $match: { vendorId: new mongoose.Types.ObjectId(currentVendor?._id) },
        },
        { $unwind: "$orderList" },
        {
          $group: {
            _id: "$orderList.menuId",
            totalQuantity: { $sum: "$orderList.quantity" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 1 },
      ]);
      const bestMenuItem = await menuCollection.findById(
        bestSellingItem[0]._id
      );
      if (!bestSellingItem || !bestMenuItem) {
        item = "No Best Selling Item";
      } else {
        item = bestMenuItem.name;
      }
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: "VENDOR EXITS",
          data: {
            vendor: {
              ...currentVendor.toObject(),
              totalCustomers,
              totalOrders,
              totalRevenue,
              bestSell: item,
            },
          },
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN VENDOR DETAILS, ${error}`,
        })
      );
    }
  }
);
