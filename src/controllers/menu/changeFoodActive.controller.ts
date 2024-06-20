import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { menuCollection } from "../../models/menu.model";
import { ApiErrors } from "../../utils/apiErrors";
import { CustomRequestT } from "../../types";
import { vendorCollection } from "../../models/vendor.model";
import { ApiResponse } from "../../utils/apiResponse";

export const changeFoodActive = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      const { activeVal, menuId } = req.body;

      // CHECK MENU ITEM
      const oldMenuItem = await menuCollection.findById(menuId);

      if (!oldMenuItem) {
        return res.json(
          new ApiErrors({
            statusCode: 404,
            statusText: "ITEM NOT FOUNDED",
          })
        );
      }
      // GET VENDOR ID FROM REQ OBJECT
      const currentVender = await vendorCollection.findById(req.vendor?._id);

      // UPDATE MENU ITEM IN DB
      const updatedMenuItem = await menuCollection
        .findByIdAndUpdate(
          { _id: menuId },
          {
            $set: {
              isActive: activeVal,
            },
          },
          {
            new: true,
          }
        )
        .select("-createdAt -updatedAt -__v");

      // CHECK MENU ITEM IS CREATED OR NOT
      if (!updatedMenuItem) {
        return res.json(
          new ApiErrors({
            statusCode: 409,
            statusText: "MENU ITEM NOT UPDATED YET, TRY AGAIN!",
          })
        );
      }

      // PUSH THE ITEMS TO VENDOR DB
      await vendorCollection.findByIdAndUpdate(
        { _id: currentVender?._id },
        {
          $addToSet: {
            menuItems: updatedMenuItem?._id, //AVOID REPLICATION
          },
        },
        {
          new: true,
        }
      );

      // SEND RESPONSE OF MENUITEM
      return res.json(
        new ApiResponse({
          statusCode: 201,
          statusText: "MENU ITEM UPDATED SUCCESSFULLY!",
          data: updatedMenuItem,
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN UPDATE MENU ITEM, ${error}`,
        })
      );
    }
  }
);
