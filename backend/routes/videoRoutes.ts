import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import uploadVideo from "../lib/videoUpload";
import imageUpload from "../lib/imageUpload";
import { upload } from "../middlewares/uploadMiddleware";
import { prisma } from "../db";

const router = Router();
router.post("/video", authMiddleware, upload.single("video"), async (req, res) => {
    const userId = (req as any).user.id;
    try {
        let channelName = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                channelName: true,
            }
        })
        if (!channelName) {
            return res.status(404).json({
                message: "Your channel not found you must've a channel to upload video",
            })
        }
        if (!req.file) {
            return res.status(400).json({ message: "No video uploaded" });
        }
        let result = await uploadVideo(req.file);
        return res.status(200).json({
            message: "Video uploaded successfully",
            url: result.secure_url,
        });

    } catch (err: any) {
        console.error("Video Route Upload Error:", err);
        return res.status(500).json({
            message: "Video upload failed",
            error: err.message || err,
        });
    }
}
);
router.post("/image", authMiddleware, (req, res) => {

    upload.single("image")(req, res, async (err) => {

        if (err) {

            return res.status(400).json({

                message: err.message || "Multer upload failed",

            });

        }

        try {

            if (!req.file) {

                return res.status(400).json({

                    message: "No image uploaded",

                });

            }

            const result = await imageUpload(req.file);

            return res.status(200).json({

                message: "Image uploaded successfully",

                url: result.secure_url,

            });

        } catch (err: any) {

            return res.status(500).json({

                message: "Image upload failed",

                error: err.message || "Something went wrong",

            });

        }

    });

});

router.post("/", authMiddleware, async (req, res) => {
    let { title, desc, videoUrl, thumbnailUrl, isDraft } = req.body;

    let userId = (req as any).user.id;
    const slug = `${title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special characters
        .replace(/\s+/g, "-")         // spaces -> hyphens
        .replace(/-+/g, "-")}-${userId}`;

    await prisma.uploads.create({ data: { title: title, description: desc, videoUrl: videoUrl, thumbnailUrl: thumbnailUrl, slug: slug, userId: userId, isDraft: isDraft } }).then((uploadCreated) => {
        res.status(200).json({
            uploadCreated
        })
    }).catch((err) => {
        res.status(500).json({ message: "Upload failed" });
        console.log(err);
    })
})

router.get("/:slug", async (req, res) => {
    let slug = req.params.slug;
    let video = await prisma.uploads.findUnique({
        where: {
            slug: slug
        }
    })
    if (!video) {
        res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video fecthed successfully", video: video });
})

router.get("/", async (req, res) => {
    let videos = await prisma.uploads.findMany();
    console.log(videos)
    if (!videos) {
        res.status(404).json({
            message: "No videos found"
        })
    }
    res.status(200).json({ "videos": videos });
});

export default router;