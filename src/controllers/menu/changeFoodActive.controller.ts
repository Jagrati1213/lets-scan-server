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
        return res.status(409).json(
          new ApiErrors({
            statusCode: 409,
            statusText: "MENU ITEM NOT UPDATED!",
          })
        );
      }

      // PUSH THE ITEMS TO VENDOR DB
      await vendorCollection.findByIdAndUpdate(
        { _id: req.vendor?._id },
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
      return res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          statusText: "MENU ITEM UPDATED SUCCESSFULLY!",
          data: updatedMenuItem,
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN UPDATE MENU ITEM, ${error}`,
        })
      );
    }
  }
);
