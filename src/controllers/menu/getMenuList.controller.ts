import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CustomRequestT } from "../../types";
import { vendorCollection } from "../../models/vendor.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";

// GET ALL MENU ITEMS
export const getMenuListController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      // GET EXIST VENDOR DETAILS
      const currentVender = await vendorCollection
        .findById(req?.vendor?._id)
        .populate({
          path: "menuItems",
          select: "-createdAt -updatedAt -__v",
        });

      if (!currentVender) {
        return res.json(
          new ApiErrors({ statusCode: 404, statusText: "VENDOR NOT FOUNDED!" })
        );
      }
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "MENU ITEMS FETCHED SUCCESSFULLY!",
          data: currentVender?.menuItems,
        })
      );
    } catch (err) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ALL MENUS ERROR, ${err}`,
        })
      );
    }
  }
);
