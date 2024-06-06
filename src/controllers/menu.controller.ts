import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { ApiErrors } from "../utils/apiErrors";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { menuCollection } from "../models/menu.model";
import { CustomRequest } from "../types";
import { userCollection } from "../models/user.model";

// CREATE NEW ITEM
export const createMenuItem = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      // GET BODY OF MENU ITEM
      const { name, price, desc } = req.body;

      // GET USER ID FROM REQ OBJECT
      const exitsUser = await userCollection
        .findById(req.user?._id)
        .select("-password -refreshToken");

      // CHECK VALIDATION FOR FIELDS
      if (!name || !price || !desc) {
        return res.json(
          new ApiErrors({
            statusCode: 401,
            statusText: "ALL FIELDS ARE REQUIRED, TRY AGAIN!",
          })
        );
      }

      // HANDLE ERROR FOR REQUEST'S FILE IN IMAGE
      if (req.files && "image" in req.files) {
        const itemImageLocalPath = req.files?.image[0]?.path;

        // ADD FILE IN CLOUD
        const itemImage = await uploadOnCloudinary(itemImageLocalPath);

        // CHECK IMAGE UPLOADED OR NOT
        if (!itemImage) {
          return res.json(
            new ApiErrors({
              statusCode: 404,
              statusText: "IMAGE IS NOT UPLOADED IN CLOUD!",
            })
          );
        }

        // ADD MENU ITEM TO DB
        const menuItem = await menuCollection.create({
          name: name,
          description: desc,
          image: itemImage,
          price: Number(price),
          rating: 2.5,
          userId: exitsUser?._id,
        });

        // CHECK MENU ITEM IS CREATED OR NOT
        const createdMenuItem = await menuCollection
          .findById(menuItem._id)
          .select("-userId -createdAt -updatedAt -__v");

        if (!createdMenuItem) {
          return res.json(
            new ApiErrors({
              statusCode: 409,
              statusText: "MENU ITEM NOT CREATED!",
            })
          );
        }

        // PUSH THE ITEMS TO USER DB
        await userCollection.findByIdAndUpdate(
          { _id: exitsUser?._id },
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
      } else {
        return res.json(
          new ApiErrors({
            statusCode: 404,
            statusText: "IMAGE IS REQUIRED!",
          })
        );
      }
    } catch (err) {
      console.error("ERROR IN CREATE MENU ITEM :", err);
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN CREATE MENU, ${err}`,
        })
      );
    }
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
