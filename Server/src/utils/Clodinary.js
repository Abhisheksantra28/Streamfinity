import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: "abhisheksantra",
  api_key: "113746788729285",
  api_secret: "c206a7O8z2hMAHLWTcnCqg99T9U",
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file has been uploaded successfully
    // console.log("file is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.log("Error uploding file on cloudinary:", error);
    fs.unlinkSync(localFilePath); //remove the locally save temporary file as the upload operation got failed
    return null;
  }
};

export const deleteFromCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      return null;
    }
    await cloudinary.uploader.destroy(filePath, function (result) {
      console.log("Delete from cloudinary result:",result);
    });
  } catch (error) {
    console.log("Error while file deleting from cloudinary");
  }
};
