import { Types } from "mongoose";
import { Request } from "express";

// CREATE INTERFACE FOR USER
export interface vendorT extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  restaurant: string;
  isOpen: boolean;
  refreshToken: string;
  menuItems: [];
  orders: [];
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

// CREATE INTERFACE FOR CUSTOM REQUEST
export interface CustomRequestT extends Request {
  vendor?: vendorT;
}
