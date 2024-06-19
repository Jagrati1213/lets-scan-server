import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CustomRequestT } from "../../types";
import { venderCollection } from "../../models/vender.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";

// GET ALL MENU ITEMS
export const getMenuListController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      // GET EXIST USER DETAILS
      const currentVender = await venderCollection
        .findById(req?.vender?._id)
        .populate({
          path: "menuItems",
          select: "-createdAt -updatedAt -__v",
        });

      if (!currentVender) {
        return res.json(
          new ApiErrors({ statusCode: 404, statusText: "USER NOT FOUNDED!" })
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
          statusText: "CANNOT FETCH MENULIST",
        })
      );
    }
  }
);
