import { Router } from "express";
import { prisma } from "../db"
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();
router.get("/profile", authMiddleware, async (req, res) => {
    let id = (req as any).user.id;
    try {
        let data = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                username: true,
                channelName: true,
                subscriberCount: true,
                banner: true,
                profilePicture: true,
                description: true,
            }
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
});
router.patch("/profile", authMiddleware, async (req, res) => {
    const id = (req as any).user.id;
    const { channelName, discription, banner, profilePicture } = req.body;

    let updates: {
        channelName?: string | undefined;
        description?: string | undefined;
        banner?: string | undefined;
        profilePicture?: string | undefined;
    } = {};

    if (channelName !== undefined && channelName.trim.length !== 0) {
        updates.channelName = channelName.trim();
    }
    if (discription !== undefined && discription.trim.length !== 0) {
        updates.channelName == channelName.trim();
    }
    if (banner !== undefined) {
        updates.banner = banner;
    }
    if (profilePicture !== undefined) {
        updates.profilePicture == profilePicture;
    }

    if (Object.keys(updates).length == 0) {
        return res.status(400).json({
            message: "Provied atleast one field to update",
        })
    }
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: id
            },
            data: updates,
            select: {
                id: true,
                username: true,
                channelName: true,
                banner: true,
                profilePicture: true,
                description: true,
            }
        })
        res.status(201).json({
            message: "Your profile has been updated",
            updatedUser: updatedUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "User can't be updated",
        })
    }

})
export default router;