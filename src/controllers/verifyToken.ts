import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  id?: string;
}
export const handleVerifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.headers.cookie;
  const token = cookies?.split("=")[1];

  if (token && process.env.SECRET_KEY) {
    jwt.verify(String(token), process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(404).json({ message: "Invalid token" });

      if (user && typeof user === "object") {
        req.id = user._id;
      }
      next();
    });
  } else {
    return res.status(400).json({ message: "Token not exits" });
  }
};
