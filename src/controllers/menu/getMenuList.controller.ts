import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CustomRequest } from "../../types";
import { userCollection } from "../../models/user.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";

// GET ALL MENU ITEMS
export const getMenuListController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      // GET EXIST USER DETAILS
      const currentUser = await userCollection
        .findById(req?.user?._id)
        .populate({
          path: "menuItems",
          select: "-createdAt -updatedAt -__v",
        });

      if (!currentUser) {
        return res.json(
          new ApiErrors({ statusCode: 404, statusText: "USER NOT FOUNDED!" })
        );
      }
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "MENU ITEMS FETCHED SUCCESSFULLY!",
          data: currentUser?.menuItems,
        })
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "CANNOT FETCH MENULIST",
      });
    }
  }
);
