import "./lib/env.ts";
import { v2 as cloudinary } from 'cloudinary';
import express, { response } from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.ts";
import userRouter from "./routes/userRoutes.ts";
import channelRouter from "./routes/channelRouter.ts";
import videoRouter from "./routes/videoRoutes.ts";
import videoActivityRouter from "./routes/videoActivityRouter.ts";
import cookieParser from "cookie-parser";
const app = express();
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
app.use("/channel", channelRouter);
app.use("/videoActivity", videoActivityRouter);

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

app.listen(process.env.PORT, () => {
    console.log("server is listning: ", process.env.PORT);
});
