"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // 1. Check if token exists
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Authentication required: No token provided'
        });
        return;
    }
    // 2. Verify the token with proper TypeScript typing
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 3. Attach user to request
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({
            success: false,
            message: 'Invalid or expired token',
            error: err.name
        });
        return;
    }
};
exports.verifyToken = verifyToken;
