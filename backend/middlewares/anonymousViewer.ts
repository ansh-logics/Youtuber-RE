import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";


export default function anonymousViewer(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (user) {
        (req as any).viewerKey = "user: " + user.id;
        return next()
    } else {
        let viewerId = req.signedCookies.anonymous_viewer_id;
        if (!viewerId) {
            const anonymousId = crypto.randomUUID();
            (req as any).viewerKey = "anonymous: " + anonymousId;
            res.cookie("anonymous_viewer_id", anonymousId, {
                httpOnly: true,
                signed: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 365 * 24 * 60 * 60 * 1000
            })
            return next();
        } else {
            (req as any).viewerKey = "anonymous: " + viewerId;
            return next();
        }
    }
}
