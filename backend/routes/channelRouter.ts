import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Prisma } from "../generated/prisma/client";

const router = Router();
router.post("/:channelId/subscribe", authMiddleware, async (req, res) => {
    const channelId = req.params.channelId as any;
    const subscriberId = (req as any).user.id;

    if (subscriberId === channelId) {
        return res.status(400).json({
            message: "you can't subscribe yourself"
        })
    }
    try {
        await prisma.$transaction(async (tx) => {
            await tx.subscription.create({
                data: {
                    subscriberId,
                    channelId,
                },
            })
            await tx.user.update({
                where: { id: channelId },
                data: {
                    subscriberCount: { increment: 1 },
                }
            })
        })
        return res.status(201).json({
            message: "subscribed successfully "
        })
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return res.status(409).json({ message: "You are already subscribed" });
            }
            if (err.code === "P2003" || err.code === "P2025") {
                return res.status(404).json({ message: "Channel not found" });
            }
        }
        console.error(err);
        return res.status(500).json({ message: "Server error encountered while performing action" });
    }
});

router.delete("/:channelId/unsubscribe", authMiddleware, async (req, res) => {
    const channelId = req.params.channelId as any;
    const subscriberId = (req as any).user.id;

    try {
        const removed = await prisma.$transaction(async (tx) => {
            const result = await tx.subscription.deleteMany({
                where: {
                    subscriberId,
                    channelId,
                }
            })
            if (result.count === 1) {
                await tx.user.update({
                    where: {
                        id: channelId
                    },
                    data: {
                        subscriberCount: { decrement: 1 }
                    }
                })
            }
            return result.count === 1;
        });
        return res.status(200).json({
            message: removed ? "Unsubscribed Sucessfully" : "you were not subscribed",
            subscribed: false,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "couldn't unsubscribe",
        })
    }
})

export default router;
