import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import mongoose from "mongoose";
import { ApiErrors } from "../../utils/apiErrors";
import { vendorCollection } from "../../models/vendor.model";
import { generateOrderTokenAndCode } from "../token/generateOrderToken.controller";
import { OrderCollection } from "../../models/order.module";
import { ApiResponse } from "../../utils/apiResponse";
import { paymentCollection } from "../../models/payment.model";

export const updateOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET ORDER DETAILS FROM REQUEST
      const {
        name,
        email,
        orderList,
        paymentId,
        vendorId,
        tableNumber,
        note,
        totalAmount,
      } = req.body;

      // VERIFY VENDOR ID
      const currentVendor = await vendorCollection.findById(vendorId);
      if (!mongoose.Types.ObjectId.isValid(vendorId) || !currentVendor) {
        return res.status(404).json(
          new ApiErrors({
            statusCode: 404,
            statusText: "INVALID VENDOR ID",
          })
        );
      }

      // VERIFY THE FIELDS
      if (!name || !email || !orderList || !orderList?.length || !totalAmount) {
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "ALL FIELDS ARE REQUIRED!",
          })
        );
      }

      // VERIFY PAYMENT DETAILS
      if (!paymentId) {
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "PAYMENT ID MISSING!",
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
        customer: { name, email },
        tableNumber: tableNumber,
        note: note,
        orderToken: token,
        verifyCode: verifyCode,
        orderStatus: "Pending",
        orderList: orderList,
        paymentId: paymentId,
        vendorId: vendorId,
        totalAmount: totalAmount | 0,
      });

      // VERIFY ORDER
      const createOrder = await OrderCollection.findById(newOrder?._id).select(
        "-vendorId -createdAt -updatedAt -__v"
      );

      if (!createOrder) {
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "ORDER NOT PLACED, TRY AGAIN!",
          })
        );
      }

      // PUSH ORDER TO VENDOR COLLECTION
      await vendorCollection.findByIdAndUpdate(
        { _id: vendorId },
        { $push: { orders: createOrder?._id } },
        { new: true }
      );

      // PUSH ORDER-ID TO PAYMENT COLLECTION
      await paymentCollection.findByIdAndUpdate(
        paymentId,
        { orderId: createOrder._id },
        { new: true }
      );

      // RETURN CREATED ORDER
      return res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          statusText: "ORDER PLACED SUCCESSFULLY!",
          data: createOrder,
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN ORDER!, ${error}`,
        })
      );
    }
  }
);
