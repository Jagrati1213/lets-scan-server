import mongoose, { Schema } from "mongoose";

// Define the Order Item Schema with timestamps
const orderItemSchema = new Schema(
  {
    menuId: {
      type: Schema.Types.ObjectId,
      ref: "MenuList",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const customerSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    require: true,
  },
});

const orderSchema = new Schema(
  {
    customer: customerSchema,
    orderList: [orderItemSchema],
    orderToken: {
      type: String,
      unique: true,
    },
    verifyCode: {
      type: Number,
      unique: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Complete"],
    },
    tableNumber: {
      type: Number,
    },
    note: {
      type: String,
    },
    totalAmount: {
      type: Number,
      require: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Vendor",
    },
  },
  { timestamps: true }
);

export const OrderCollection = mongoose.model("Order", orderSchema);
