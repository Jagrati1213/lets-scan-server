import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userTypes } from "../types";

// CREATE USER SCHEMA
const userSchema = new Schema<userTypes>(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    refreshToken: {
      type: String,
    },
    menuItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    // orders: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Order",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

// CREATE HASH PASSWORD BEFORE SAVING
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } else {
    next();
  }
});

// COMPARE PASSWORD WITH BCRYPT
userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password); // return boolean
};

// CREATE ACCESS TOKEN
userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_KEY) return;
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// CREATE REFRESH TOKEN
userSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_KEY) return;
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// CREATE USER COLLECTION IN DB
export const userCollection = mongoose.model<userTypes>("User", userSchema);
