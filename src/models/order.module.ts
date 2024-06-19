import { timeStamp } from "console";
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
        menuId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          require: true,
        },
        timeStamp: true,
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
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Success"],
    },
    tableNumber: {
      type: Number,
    },
    note: {
      type: String,
    },
    venderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Vender",
    },
  },
  { timestamps: true }
);

export const OrderCollection = mongoose.model("Order", orderSchema);
