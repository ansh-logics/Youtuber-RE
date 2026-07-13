import fs from "fs/promises";
import crypto from "crypto";
import "./env.ts";

export default async function imageUpload(file: Express.Multer.File) {
  try {
    const timestamp = Math.round(Date.now() / 1000).toString();
    const folder = "images";
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();

    if (!apiSecret || !apiKey || !cloudName) {
      throw new Error("Cloudinary environment variables are missing");
    }

    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    const formData = new FormData();
    const fileBuffer = await fs.readFile(file.path);

    formData.append("file", new Blob([fileBuffer]), file.originalname);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("folder", folder);
    formData.append("signature", signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as any;

    if (!response.ok) {
      throw new Error(result.error?.message || "Image upload failed");
    }

    console.log("Image Upload Success:", result.secure_url);
    return result;
  } catch (err: any) {
    console.error("Image Upload Error Log:", err);
    throw new Error(err.message || "Image upload failed");
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
}
