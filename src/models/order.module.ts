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
    paymentDetails: {
      orderId: {
        type: String,
        require: true,
      },
      paymentId: {
        type: String,
        require: true,
      },
    },
    orderStatus: {
      type: String,
      enum: ["pickup", "ready", "success", "reject"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const OrderCollection = mongoose.model("Order", orderSchema);
