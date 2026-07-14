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
    const { channelName, bio, profilePicture } = req.body;
})
export default router;