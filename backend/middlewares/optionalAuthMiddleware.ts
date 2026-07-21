import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next();
    } else {
        const token = authHeader?.split(" ")[1];
        if (!token) {
            return res.status(403).json({
                error: "Authorization Token not found"
            })
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!
            );
            (req as any).user = decoded;
            next();
        } catch (err) {
            console.log(err);
            res.status(403).json({
                error: "token not varified"
            })
        }
    }

}