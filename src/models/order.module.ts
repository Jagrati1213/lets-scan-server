import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    orderList: [
      {
        id: String,
        quantity: Number,
      },
    ],
    orderToken: {
      type: String,
      unique: true,
    },
    verifyCode: {
      type: String,
      unique: true,
    },
    paymentDetails: {},
  },
  { timestamps: true }
);

export const OrderCollection = mongoose.model("Order", orderSchema);
