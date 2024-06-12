import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadOnCloudinary } from "../../utils/cloudinary";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";

export const uploadImageController = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.files && "image" in req.files) {
      const localPath = req?.files?.image[0]?.path;
      const uploadedUrl = await uploadOnCloudinary(localPath);

      if (!uploadedUrl) {
        return res.json(
          new ApiErrors({
            statusText: "FILE NOT UPLOADED!",
            statusCode: 400,
          })
        );
      }

      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: "IMAGE UPLOADED SUCCESSFULLY!",
          data: { url: uploadedUrl },
        })
      );
    } else {
      return res.json({
        message: "IMAGE IS NOT GIVEN",
      });
    }
  }
);
