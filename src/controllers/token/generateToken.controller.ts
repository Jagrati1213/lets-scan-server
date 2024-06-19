import { Types } from "mongoose";
import { vendorCollection } from "../../models/vendor.model";
import { ApiErrors } from "../../utils/apiErrors";

export const generateAccessAndRefreshToken = async (
  vendorId: Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
  try {
    const vendor = await vendorCollection.findOne({ _id: vendorId });
    if (!vendor) return;
    const accessToken = vendor.generateAccessToken();
    const refreshToken = vendor.generateRefreshToken();

    // SET REFRESH TOKEN IN DB
    vendor.refreshToken = refreshToken;
    await vendor.save({ validateBeforeSave: false });

    // RETURN TOKEN
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors({
      statusCode: 500,
      statusText: "CREATED TOKEN ERROR",
    });
  }
};
