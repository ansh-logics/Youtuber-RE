import fs from "fs/promises";
import crypto from "crypto";
import "./env.ts";

export default async function uploadVideo(file: Express.Multer.File) {
  try {
    console.log("Uploading:", file.path);

    const timestamp = Math.round(Date.now() / 1000).toString();
    const folder = "videos";
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();

    console.log("Cloudinary Config:", {
      cloud: cloudName,
      key: apiKey,
      secretLoaded: !!apiSecret,
    });

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

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as any;

    if (!response.ok) {
      console.error("Cloudinary Error:", result.error ?? result);
      throw new Error(result.error?.message || "Video upload failed");
    }

    console.log("✅ Upload Success:", result.secure_url);

    return result;
  } catch (err) {
    console.error("❌ Upload Failed:", err);
    throw err;
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
}
