import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { ApiErrors } from "../utils/apiErrors";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { menuCollection } from "../models/menu.model";

export const createMenuItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // GET BODY OF MENU ITEM
      const { name, price, desc } = req.body;

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
        });

        // CHECK MENU ITEM IS CREATED OR NOT
        const createdMenuItem = await menuCollection.findById(menuItem._id);

        if (!createdMenuItem) {
          return res.json(
            new ApiErrors({
              statusCode: 409,
              statusText: "MENU ITEM NOT CREATED!",
            })
          );
        }

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
