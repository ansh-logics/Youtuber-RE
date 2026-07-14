import { Router, } from "express";
import { prisma } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = Router();
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
router.post("/login", async (req, res) => {
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

router.post("/signup", async (req, res) => {
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
export default router;