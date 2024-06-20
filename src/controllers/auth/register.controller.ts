import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { vendorCollection } from "../../models/vendor.model";
import { ApiResponse } from "../../utils/apiResponse";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET VENDOR'S DETAILS
      const { username, password, email, restaurant } = req.body;

      // CHECK VALIDATION FOR FIELDS
      if (!username || !email || !password || !restaurant) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "ALL FIELDS REQUIRED!",
          })
        );
      }

      // CHECK VENDOR EXISTENCE WITH USERNAME & EMAIL
      const currentVender = await vendorCollection.findOne({
        $or: [{ username }, { email }],
      });

      if (currentVender) {
        return res.json(
          new ApiErrors({
            statusCode: 403,
            statusText: "VENDOR ALREADY EXITS!",
          })
        );
      }

      // STORE INTO DB & CHECK THE VENDOR CREATED OR NOT
      const newVender = await vendorCollection.create({
        username: username.toLowerCase(),
        password,
        email,
        restaurant,
      });

      // REMOVE PASSWORD AND OTHER THINGS FROM RESPONSE
      const vendorCreated = await vendorCollection
        .findById(newVender._id)
        .select(
          "-password -refreshToken -createdAt -updatedAt -__v -menuItems -orders"
        );

      if (!vendorCreated)
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "VENDOR NOT CREATED, PLEASE RE-CREATE ACCOUNT!",
          })
        );

      // RETURN RESPONSE
      return res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          statusText: "VENDOR CREATED SUCCESSFULLY.",
          data: vendorCreated,
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 401,
          statusText: `REGISTER ERROR, ${error}`,
        })
      );
    }
  }
);
