import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CustomRequest } from "../../types";
import { userCollection } from "../../models/user.model";
import { ApiErrors } from "../../utils/apiErrors";
import { menuCollection } from "../../models/menu.model";
import { ApiResponse } from "../../utils/apiResponse";

// DELETE MENU ITEM
export const deleteMenuItemController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    // GET MENU ID
    const { menuId } = req.params;

    // GET USER ID FROM REQ OBJECT
    const currentUser = await userCollection
      .findById(req.user?._id)
      .select("-password -refreshToken");

    // CHECK USER PRESENTS
    if (!currentUser) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "UNAUTHORIZED USER!",
        })
      );
    }

    // DELETE FROM USER COLLECTION
    await userCollection.findByIdAndUpdate(
      { _id: currentUser?._id },
      {
        $pull: { menuItems: menuId },
      },
      {
        new: true,
      }
    );

    // FIND & DELETE MENU ITEM
    const oldMenuItem = await menuCollection.findByIdAndDelete(menuId, {
      new: true,
    });

    if (!oldMenuItem) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "INVALID MENU ITEM!",
        })
      );
    }

    // SEND RESPONSE
    return res.json(
      new ApiResponse({
        statusCode: 200,
        statusText: "ITEM DELETED SUCCESSFULLY!",
        data: null,
      })
    );
  }
);
