import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CustomRequestT } from "../../types";
import { venderCollection } from "../../models/vender.model";
import { ApiErrors } from "../../utils/apiErrors";
import { menuCollection } from "../../models/menu.model";
import { ApiResponse } from "../../utils/apiResponse";

// DELETE MENU ITEM
export const deleteMenuItemController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      // GET MENU ID
      const { menuId } = req.params;

      // GET USER ID FROM REQ OBJECT
      const currentVender = await venderCollection.findById(req.vender?._id);

      // CHECK USER PRESENTS
      if (!currentVender) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "UNAUTHORIZED USER!",
          })
        );
      }

      // DELETE FROM USER COLLECTION
      await venderCollection.findByIdAndUpdate(
        { _id: currentVender?._id },
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
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "ERROR IN MENU DELETE OPERATION",
        })
      );
    }
  }
);
