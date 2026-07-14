import "./lib/env.ts";
import { upload } from "./middlewares/uploadMiddleware.ts";
import { v2 as cloudinary } from 'cloudinary';
import express, { response } from "express";
import { prisma } from "./db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import cors from "cors";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
import uploadVideo from "./lib/videoUpload.ts";
import imageUpload from "./lib/imageUpload.ts";
const app = express();
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(express.json());
const generateToken = (id: string) => {
    const token = jwt.sign(
        {
            id: id
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "7d"
        }
    );
    return token;
}
app.get("/", (_req, res) => {
    res.status(200).json({
        "message": "Hello there"
    })
}
)

app.get("/test-config", (req, res) => {
    res.json({
        cloudinary: cloudinary.config(),
        env_check: {
            has_url: !!process.env.CLOUDINARY_URL,
            has_name: !!process.env.CLOUDINARY_CLOUD_NAME
        }
    });
});


app.post("/upload/video", authMiddleware, upload.single("video"), async (req, res) => {
    try {
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
app.post("/upload/image", authMiddleware, (req, res) => {

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

app.post("/upload", authMiddleware, async (req, res) => {
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

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    let user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    console.log(user);
    if (!user) {
        return res.status(404).json({
            message: "user not found credentials are wrong"
        })
    }
    let jwt_token = generateToken(user.id);
    prisma.user.update({
        where:
        {
            id: user.id
        },
        data: {
            accessToken: jwt_token
        }
    })
    return res.status(200).json({
        username: user.username,
        id: user.id,
        token: jwt_token
    })
});

app.post("/auth/signup", async (req, res) => {
    const { email, username, password, gender, firstName, lastName, dob } = req.body;
    let user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    console.log(user)
    if (user) {
        return res.status(409).json({
            message: "User already exists use different credentials"
        })
    }
    let jwt_token = generateToken(email);
    try {
        let hashedpass = await bcrypt.hash(password, 10);
        let createdUser = await prisma.user.create({ data: { email, username, password: hashedpass, gender, firstName, lastName, dob: new Date(dob) } });
        return res.status(200).json({
            message: "user has been created",
            user: {
                name: createdUser.username,
                email: createdUser.email,
                dob: createdUser.dob
            },
            token: jwt_token

        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "internal server error"
        });
    }

})
app.get("/user/profile", authMiddleware, async (req, res) => {
    let id = (req as any).user.id;
    try {
        let data = await prisma.user.findUnique({
            where: {
                id: id
            },
        });
        let uploads = await prisma.uploads.findMany({
            where: {
                userId: id
            }
        });
        res.status(200).json({ message: "data fetching was successfull", data: data, uploads: uploads });
    } catch (err) {
        res.status(500).json({ message: "we got error while getting the data" });
    }
})
app.get("/video/:slug", async (req, res) => {
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

app.get("/videos", async (req, res) => {
    let videos = await prisma.uploads.findMany();
    console.log(videos)
    if (!videos) {
        res.status(404).json({
            message: "No videos found"
        })
    }
    res.status(200).json({ "videos": videos });
});
app.listen(process.env.PORT, () => {
    console.log("server is listning: ", process.env.PORT);
});
