import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string; // Prisma IDs are often strings (UUID), change to number if using SQL auto-increment
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }

    // Format: "Bearer <token>"
    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error("CRITICAL: JWT_SECRET is missing in env");
        return res.status(500).json({ message: "Server configuration error" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}