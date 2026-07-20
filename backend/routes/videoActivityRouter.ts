import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Prisma } from "../generated/prisma/client";

const router = Router();


router.post("/:videoId/like", authMiddleware, async (req, res) => {
    const videoId = req.params.videoId as any;
    const userId = (req as any).user.id;
    try {
        await prisma.$transaction(async (tx) => {
            await tx.like.create({
                data: {
                    userId,
                    videoId
                }
            })
            await tx.uploads.update({
                where: {
                    id: videoId,
                },
                data: {
                    like: { increment: 1 }
                }
            })
        })
        res.status(200).json({
            message: "Liked video"
        })

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return res.status(409).json({ message: "You have already liked this video" });
            }
            if (err.code === "P2003" || err.code === "P2025") {
                return res.status(404).json({ message: "Video not found" });
            }
        }
        console.error(err);
        return res.status(500).json({ message: "Couldn't like" });
    }
})

router.delete("/:videoId/like", authMiddleware, async (req, res) => {
    const videoId = req.params.videoId as any;
    const userId = (req as any).user.id;

    try {
        const unliked = await prisma.$transaction(async (tx) => {
            const result = await tx.like.deleteMany({
                where: {
                    userId,
                    videoId
                }
            })
            if (result.count === 1) {
                await tx.uploads.update({
                    where: {
                        id: videoId
                    },
                    data: {
                        like: { decrement: 1 }
                    }
                })
            }
            return result.count === 1;
        })
        return res.status(200).json({ message: unliked ? "Unliked Video" : "You haven't liked the video" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "unable to like the video" });

    }
});
router.post("/:videoId/watch", authMiddleware, async (req, res) => {
    const date = new Date();
    console.log(1)
    const userId = (req as any).user.id;
    console.log(2)
    const videoId = req.params.videoId as string;
    console.log(3)
    const lastWatched = await prisma.history.findFirst({
        where: {
            userId, videoId
        },
        select: {
            createdAt: true
        }
    })
    console.log(4)
    const currentDate = date.toISOString().slice(0, 10);
    console.log(5)
    const dbDate = lastWatched
        ? lastWatched.createdAt.toISOString().slice(0, 10)
        : null;
    console.log(6)
    if (lastWatched) {
        console.log(7)
        if (currentDate == dbDate) {
            return res.status(403).json({
                message: "View not registered"
            })
        }
        console.log(8);
        try {
            await prisma.$transaction(async (tx) => {
                await tx.history.update({
                    where: {
                        userId_videoId: {
                            userId,
                            videoId
                        }
                    },
                    data: {
                        createdAt: date
                    }
                })
                await tx.uploads.update({
                    where: {
                        id: videoId
                    },
                    data: {
                        views: { increment: 1 }
                    }
                })
            })
            return res.status(200).json({
                message: "Successfully registered"
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong"
            })
        }
    }
    try {
        await prisma.$transaction(async (tx) => {
            await tx.history.create({
                data: {
                    userId,
                    videoId
                }
            })

            await tx.uploads.update({
                where: {
                    id: videoId
                },
                data: {
                    views: { increment: 1 }
                }
            })
        })
        return res.status(200).json({
            message: "View is registered"
        })
    } catch (error) {
        return res.status(500).json({ message: "something went wrong" })
    }
});


export default router;
