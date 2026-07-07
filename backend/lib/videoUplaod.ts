import crypto from "crypto";
export default async function uploadVideo(file: Express.Multer.File ){
    try{
        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        const folder = "videos";
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
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
        const response = await fetch(cloudinaryUrl, {
            method: "POST",
            body: formData,
        });
        const text = await response.text();

        let result: any;
        try {
            result = JSON.parse(text);
        } catch {
        console.error("Cloudinary non-JSON response:", {
            status: response.status,
            statusText: response.statusText,
            body: text,
        });

        throw new Error(`Cloudinary returned non-JSON response. Status: ${response.status}`);
        }

        if (!response.ok) {
            throw new Error(result.error?.message || "Cloudinary upload failed");
        }
        console.log("Direct Upload Success:", result.secure_url);
        return result;
    } catch (err: any) {
        console.error("Direct Upload Error Log:", err);
        throw new Error(err);

}};