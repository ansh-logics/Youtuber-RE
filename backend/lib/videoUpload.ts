import fs from "fs/promises";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
});

function uploadLargeVideo(filePath: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        resource_type: "video",
        folder: "videos",
        chunk_size: 6 * 1024 * 1024,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return reject(error);
        }

        if (!result) {
          return reject(new Error("No Cloudinary result returned"));
        }

        // upload_large sends intermediate responses.
        if ("done" in result && result.done === false) {
          return;
        }

        resolve(result as UploadApiResponse);
      }
    );
  });
}

export default async function uploadVideo(file: Express.Multer.File) {
  try {
    console.log("Uploading:", file.path);

    console.log("Cloudinary Config:", {
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
      key: process.env.CLOUDINARY_API_KEY,
      secretLoaded: !!process.env.CLOUDINARY_API_SECRET,
    });

    const result = await uploadLargeVideo(file.path);

    console.log("✅ Upload Success:", result.secure_url);

    return result;
  } catch (err) {
    console.error("❌ Upload Failed:", err);
    throw err;
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
}