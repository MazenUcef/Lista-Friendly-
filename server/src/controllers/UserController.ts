import { NextFunction, Request, Response } from "express";

const Signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        }).status(200).json("User has been logged out successfully")
    } catch (error) {
        next(error)
    }
};


export default {
    Signout,
};