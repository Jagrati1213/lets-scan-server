import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiErrors } from "../../utils/apiErrors";
import { vendorCollection } from "../../models/vendor.model";
import mongoose from "mongoose";

export const getAllMenuItemsController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET VENDER ID
      const { vendorId } = req.params;

      // VERIFY VENDER ID
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "INVALID VENDER ID",
          })
        );
      }

      // CHECK VENDER
      const currentVendor = await vendorCollection.findById(vendorId).populate({
        path: "menuItems",
        match: { isActive: true },
        select: "-createdAt -updatedAt -__v -vendorId -isActive",
      });

      if (!currentVendor) {
        return res.status(404).json(
          new ApiErrors({
            statusCode: 404,
            statusText: "VENDER NOT FOUNDED!",
          })
        );
      }
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: "ALL MENU LISTS",
          data: {
            menuItems: currentVendor.menuItems,
            isOpen: currentVendor.isOpen,
            restaurant: currentVendor.restaurant,
          },
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ALL MENU ERROR, ${error}`,
        })
      );
    }
  }
);
