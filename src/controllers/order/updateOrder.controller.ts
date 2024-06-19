import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import mongoose from "mongoose";
import { ApiErrors } from "../../utils/apiErrors";
import { venderCollection } from "../../models/vender.model";
import { generateOrderTokenAndCode } from "../token/generateOrderToken.controller";
import { OrderCollection } from "../../models/order.module";
import { ApiResponse } from "../../utils/apiResponse";
import bcrypt from "bcrypt";
import { paymentCollection } from "../../models/payment.model";

export const updateOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET ORDER DETAILS FROM REQUEST
      const { name, email, orderList, paymentId, venderId } = req.body;

      // VERIFY USER ID
      if (!mongoose.Types.ObjectId.isValid(venderId)) {
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

      // VERIFY PAYMENT DETAILS
      if (!paymentId) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "PROVIDE PAYMENT DETAILS!",
          })
        );
      }

      //TODO: CHECK THAT EMAIL IS ALREADY PRESENT

      // FIND CURRENT USER
      const currentVender = await venderCollection.findById(venderId);

      if (!currentVender) {
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

      // BCRYPT VERIFY CODE
      const bcryptVerifyCode = await bcrypt.hash(verifyCode, 4);

      // PUSH THE ORDER DETAILS, TOKEN, & VERIFY CODE TO ORDER COLLECTION
      const newOrder = await OrderCollection.create({
        name: name,
        email: email,
        orderToken: token,
        verifyCode: bcryptVerifyCode,
        orderStatus: "Placed",
        venderId: currentVender._id,
        orderList: orderList,
      });

      const updatedOrder = await OrderCollection.findByIdAndUpdate(
        newOrder._id,
        {
          paymentId: paymentId,
        },
        { new: true }
      );

      // VERIFY ORDER
      const createOrder = await OrderCollection.findById(updatedOrder?._id);

      if (!createOrder) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "ORDER NOT PLACED, TRY AGAIN!",
          })
        );
      }

      // PUSH ORDER TO USER COLLECTION
      await venderCollection.findByIdAndUpdate(
        { _id: venderId },
        {
          $push: {
            orders: createOrder?._id,
          },
        },
        {
          new: true,
        }
      );

      // PUSH ORDER-ID TO PAYMENT COLLECTION
      await paymentCollection.findByIdAndUpdate(
        paymentId,
        { orderId: createOrder._id },
        { new: true }
      );

      // RETURN TOKEN & VERIFY CODE
      return res.json(
        new ApiResponse({
          statusCode: 201,
          statusText: "ORDER PLACED SUCCESSFULLY!",
          data: createOrder,
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN INTERNAL!, ${error}`,
        })
      );
    }
  }
);
