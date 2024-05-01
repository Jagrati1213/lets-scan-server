import mongoose, { Schema } from "mongoose";

// CREATE MENU SCHEMA
const menuSchema = new Schema(
  {
    name: {
      String,
    },
    description: {
      String,
    },
    image: {
      String,
    },
    rating: {
      Number,
    },
    price: {
      Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const menuCollection = mongoose.model("Menu", menuSchema);
