import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiErrors } from "../../utils/apiErrors";
import crypto from "crypto";
import { paymentCollection } from "../../models/payment.model";
import { ApiResponse } from "../../utils/apiResponse";

export const paymentVerifyController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // GET RAZOR PAYMENT DETAILS
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;

      // CHECK ENV VALUES
      if (!process.env.RAZOR_API_KEY_ID || !process.env.RAZOR_API_KEY_SECRET)
        return;

      // CHECK IS RAZOR PAY ORDER GENIUS
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZOR_API_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      // STORE IN DATABASE & REDIRECT TO CLIENT
      if (!generated_signature == razorpay_signature) {
        return res.json(
          new ApiErrors({
            statusText: "TRANSACTION IS NOT DIGEST",
            statusCode: 500,
          })
        );
      }

      // STORE IN PAYMENT DATABASE
      const paymentData = await paymentCollection.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId: null,
      });

      // RETURN RESPONSE TO CLIENT
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "PAYMENT SUCCESSFUL!",
          data: {
            paymentId: paymentData._id,
          },
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusText: `ERROR IN RAZOR VERIFY CREATION!, ${error}`,
          statusCode: 500,
        })
      );
    }
  }
);
