import { NextFunction, Response, Request } from "express";
import { userCollection } from "../models/useSchema";

interface CustomRequest extends Request {
  id?: string;
}
export const handleGetUserDetails = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.id;
  try {
    let user = await userCollection.findById(userId, "-password");
    if (!user) {
      throw new Error("User not founded");
    }
    return res.json({ message: "User Exits", user });
  } catch (error) {
    return res.json({ message: error });
  }
};
