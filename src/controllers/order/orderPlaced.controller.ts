import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import mongoose from "mongoose";
import { ApiErrors } from "../../utils/apiErrors";
import { userCollection } from "../../models/user.model";
import { generateOrderTokenAndCode } from "../token/generateOrderToken.controller";
import { OrderCollection } from "../../models/order.module";
import { ApiResponse } from "../../utils/apiResponse";

export const orderPlacedController = asyncHandler(
  async (req: Request, res: Response) => {
    // GET USER ID
    const { userId } = req.params;

    // GET ORDER DETAILS FROM REQUEST
    const { name, email, orderList } = req.body;

    // VERIFY USER ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json(
        new ApiErrors({
          statusCode: 404,
          statusText: "Invalid USER ID",
        })
      );
    }

    // VERIFY THE FIELDS
    if (!name || !email || !orderList || !orderList?.length) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "ALL FIELDS ARE REQUIRED!",
        })
      );
    }

    // CHECK THAT EMAIL IS ALREADY PRESENT

    // FIND CURRENT USER
    const currentUser = await userCollection.findById(userId);

    if (!currentUser) {
      return res.json(
        new ApiErrors({
          statusCode: 404,
          statusText: "USER NOT FOUNDED!",
        })
      );
    }

    // GENERATE TOKEN(6) & VERIFY CODE(4)
    const { token, verifyCode } = generateOrderTokenAndCode({
      tokenLength: 6,
      codeLength: 4,
    });

    // PUSH THE ORDER DETAILS, TOKEN, & VERIFY CODE TO ORDER COLLECTION
    const newOrder = await OrderCollection.create({
      name: name,
      email: email,
      orderToken: token,
      verifyCode: verifyCode,
      orderStatus: "pickup",
      userId: currentUser._id,
      orderList: orderList,
    });

    // VERIFY ORDER
    const createOrderItems = await OrderCollection.findById(newOrder._id);

    if (!createOrderItems) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: "ORDER NOT PLACED, TRY AGAIN!",
        })
      );
    }

    // PUSH ORDER TO USER COLLECTION
    await userCollection.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          orders: createOrderItems?._id,
        },
      }
    );

    // RETURN TOKEN & VERIFY CODE
    return res.json(
      new ApiResponse({
        statusCode: 201,
        statusText: "ORDER PLACED SUCCESSFULLY!",
        data: createOrderItems,
      })
    );
  }
);
