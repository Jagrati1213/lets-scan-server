import { Types } from "mongoose";
import { venderCollection } from "../../models/vender.model";
import { ApiErrors } from "../../utils/apiErrors";

export const generateAccessAndRefreshToken = async (
  venderId: Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
  try {
    const vender = await venderCollection.findOne({ _id: venderId });
    if (!vender) return;
    const accessToken = vender.generateAccessToken();
    const refreshToken = vender.generateRefreshToken();

    // SET REFRESH TOKEN IN DB
    vender.refreshToken = refreshToken;
    await vender.save({ validateBeforeSave: false });

    // RETURN TOKEN
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors({
      statusCode: 500,
      statusText: "CREATED TOKEN ERROR",
    });
  }
};
