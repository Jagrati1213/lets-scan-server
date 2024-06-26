import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";

// Load environment variables
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return;

    // UPLOADED FILE
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: "Let's Scan",
    });

    // UNLINK FILE AFTER UPLOAD
    fs.unlinkSync(localFilePath);

    // RETURN URL
    return response.url;
  } catch (err) {
    // UNLINK FILES IN LOCALLY SAVED, IF CLOUDINARY FAILED
    fs.unlinkSync(localFilePath);
    console.log("ERROR IN CLOUD", err);
    return null;
  }
};
