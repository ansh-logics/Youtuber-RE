// lib/imageUpload.ts
import crypto from "crypto";

export default async function imageUpload(file: Express.Multer.File) {
  try {
    const timestamp = Math.round(Date.now() / 1000).toString();

    const folder = "images";

    // Params must match exactly what you send to Cloudinary
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

    const apiSecret = process.env.CLOUDINARY_API_SECRET!;

    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    const formData = new FormData();

    const fileBlob = new Blob([await Bun.file(file.path).arrayBuffer()]);

    formData.append("file", fileBlob, file.originalname);
    formData.append("api_key", process.env.CLOUDINARY_API_KEY!);
    formData.append("timestamp", timestamp);
    formData.append("folder", folder);
    formData.append("signature", signature);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;

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
  }
}