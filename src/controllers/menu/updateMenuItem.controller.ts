import { Response } from "express";
import { CustomRequest } from "../../types";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { menuCollection } from "../../models/menu.model";
import { userCollection } from "../../models/user.model";
import { ApiResponse } from "../../utils/apiResponse";

// UPDATE MENU ITEM
export const updateMenuItemController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      // GET BODY OF MENU ITEM
      const { name, price, desc, menuId, image } = req.body;

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
      const currentUser = await userCollection
        .findById(req.user?._id)
        .select("-password -refreshToken");

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
      await userCollection.findByIdAndUpdate(
        { _id: currentUser?._id },
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
