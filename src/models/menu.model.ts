import mongoose, { Schema } from "mongoose";

// CREATE MENU SCHEMA
const menuSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    rating: {
      type: Number,
    },
    price: {
      type: Number,
      require: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const menuCollection = mongoose.model("MenuList", menuSchema);
