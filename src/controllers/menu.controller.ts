import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { ApiErrors } from "../utils/apiErrors";
import { menuCollection } from "../models/menu.model";
import { CustomRequest } from "../types";
import { userCollection } from "../models/user.model";

// CREATE NEW ITEM
export const createMenuItem = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      // GET BODY OF MENU ITEM
      const { name, price, desc, image } = req.body;

      // GET USER ID FROM REQ OBJECT
      const currentUser = await userCollection
        .findById(req.user?._id)
        .select("-password -refreshToken");

      // CHECK VALIDATION FOR FIELDS
      if (!name || !price || !desc || !image) {
        return res.json(
          new ApiErrors({
            statusCode: 401,
            statusText: "ALL FIELDS ARE REQUIRED!",
          })
        );
      }

      // ADD MENU ITEM TO DB
      const menuItem = await menuCollection.create({
        name: name,
        description: desc,
        image: image,
        price: Number(price),
        rating: 2.5,
        userId: currentUser?._id,
      });

      // CHECK MENU ITEM IS CREATED OR NOT
      const createdMenuItem = await menuCollection
        .findById(menuItem._id)
        .select("-createdAt -updatedAt -__v");

      if (!createdMenuItem) {
        return res.json(
          new ApiErrors({
            statusCode: 409,
            statusText: "MENU ITEM CREATED FAILED!",
          })
        );
      }

      // PUSH THE ITEMS TO USER DB
      await userCollection.findByIdAndUpdate(
        { _id: currentUser?._id },
        {
          $push: {
            menuItems: createdMenuItem?._id,
          },
        }
      );

      // SEND RESPONSE OF MENUITEM
      return res.json(
        new ApiResponse({
          statusCode: 201,
          statusText: "MENU ITEM CREATED SUCCESSFULLY!",
          data: createdMenuItem,
        })
      );
    } catch (err) {
      console.error("ERROR IN CREATE MENU ITEM FAILED :", err);
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN CREATE MENU, ${err}`,
        })
      );
    }
  }
);

// UPDATE MENU ITEM
export const updateMenuItem = asyncHandler(
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
            name: name,
            description: desc,
            image: image,
            price: Number(price),
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

// DELETE MENU ITEM
export const deleteMenuItem = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    // GET MENU ID
    const { menuId, userId } = req.body;

    // FIND & DELETE MENU ITEM
    const oldMenuItem = await menuCollection.findByIdAndDelete(menuId);

    if (!oldMenuItem) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "ITEM NOT DELETED!",
        })
      );
    }

    // DELETE FROM USER COLLECTION
    await userCollection.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: { menuItems: menuId },
      },
      {
        new: true,
      }
    );

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

// GET ALL MENU ITEMS
export const getAllMenuList = asyncHandler(
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
          statusText: "USER MENU ITEMS FETCHED SUCCESSFULLY!",
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
