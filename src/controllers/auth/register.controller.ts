import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import { userCollection } from "../../models/user.model";
import { ApiResponse } from "../../utils/apiResponse";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    // GET USER'S DETAILS
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

    // CHECK USER EXISTENCE WITH USERNAME & EMAIL
    const exitsUser = await userCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (exitsUser) {
      return res.json(
        new ApiErrors({ statusCode: 403, statusText: "USER ALREADY EXITS!" })
      );
    }

    // STORE INTO DB & CHECK THE USER CREATED OR NOT
    const newUser = await userCollection.create({
      username: username.toLowerCase(),
      password,
      email,
      restaurant,
    });

    // REMOVE PASSWORD AND TOKEN FROM RESPONSE
    const userCreated = await userCollection
      .findById(newUser._id)
      .select("-password -refreshToken -createdAt -updatedAt -__v");

    if (!userCreated)
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "USER NOT CREATED, PLEASE RE-CREATE ACCOUNT!",
        })
      );

    // RETURN RESPONSE
    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        statusText: "USER CREATED SUCCESSFULLY.",
        data: userCreated,
      })
    );
  }
);
