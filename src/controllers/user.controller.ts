import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiErrors } from "../utils/apiErrors";
import { userCollection } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // GET USER'S DETAILS
    const { username, password, email } = req.body;

    // CHECK VALIDATION FOR FIELDS
    console.log(username);
    if (!username || !email || !password) {
      throw new ApiErrors({ statusCode: 400, message: "ALL FIELDS REQUIRED!" });
    }

    // CHECK USER EXISTENCE WITH USERNAME & EMAIL
    const exitsUser = await userCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (exitsUser) {
      throw new ApiErrors({ statusCode: 403, message: "USER ALREADY EXITS!" });
    }

    // STORE INTO DB & CHECK THE USER CREATED OR NOT
    const newUser = await userCollection.create({
      username: username.toLowerCase(),
      password,
      email,
    });

    // REMOVE PASSWORD AND TOKEN FROM RESPONSE
    const userCreated = await userCollection
      .findById(newUser._id)
      .select("-password -refreshToken");

    if (!userCreated)
      throw new ApiErrors({
        statusCode: 400,
        message: "USER NOT CREATED, PLEASE RE-CREATE ACCOUNT!",
      });

    // RETURN RESPONSE
    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message: "USER CREATED SUCCESSFULLY.",
        data: userCreated,
      })
    );
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // GET USER'S DETAILS
    // CHECK VALIDATION FOR FIELDS
    // CONVERT HASH TO PLAIN IN PASSWORD
    // CREATE TOKEN
    // CHECK USER'S EXISTENCE
    // RETURN RESPONSE
  }
);
