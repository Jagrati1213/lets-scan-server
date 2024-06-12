import { Types } from "mongoose";
import { userCollection } from "../../models/user.model";
import { ApiErrors } from "../../utils/apiErrors";

export const generateAccessAndRefreshToken = async (
  userId: Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
  try {
    const user = await userCollection.findOne({ _id: userId });
    if (!user) return;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // SET REFRESH TOKEN IN DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // RETURN TOKEN
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors({
      statusCode: 500,
      statusText: "CREATED TOKEN ERROR",
    });
  }
};
