import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Type definitions
interface JwtPayload {
    id: string;
    [key: string]: any;
}

// Extend the Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    // 1. Check if token exists
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Authentication required: No token provided'
        });
        return
    }

    // 2. Verify the token with proper TypeScript typing
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // 3. Attach user to request
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({
            success: false,
            message: 'Invalid or expired token',
            error: (err as jwt.VerifyErrors).name
        });
        return
    }
};