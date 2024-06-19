import { Response } from "express";
import { CustomRequestT } from "../../types";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { menuCollection } from "../../models/menu.model";
import { vendorCollection } from "../../models/vendor.model";
import { ApiResponse } from "../../utils/apiResponse";

// UPDATE MENU ITEM
export const updateMenuItemController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      // GET BODY OF MENU ITEM
      const { name, price, desc, menuId, image, type } = req.body;

      // CHECK FIELDS
      if (!name || !price || !desc) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: `ALL FIELDS REQUIRED!`,
          })
        );
      }

      // CHECK MENU ID EXITS OR NOT
      const oldMenuItem = await menuCollection.findById(menuId);
      if (!oldMenuItem) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "MENU ITEM NOT EXITS!",
          })
        );
      }

      // GET USER ID FROM REQ OBJECT
      const currentVender = await vendorCollection.findById(req.vendor?._id);

      // TODO: FIX REPLICATION IN CLOUD

      // UPDATE MENU ITEM IN DB
      const updatedMenuItem = await menuCollection
        .findByIdAndUpdate(
          { _id: menuId },
          {
            $set: {
              name: name,
              description: desc,
              image: image,
              price: Number(price),
              isVeg: type,
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

      // PUSH THE ITEMS TO USER DB
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
    } catch (err) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN UPDATE MENU ITEM, ${err}`,
        })
      );
    }
  }
);
