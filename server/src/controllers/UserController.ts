import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import User from "../modals/user.modal";


const Signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            partitioned: true
        }).status(200).json({
            message: "User has been logged out successfully",
            token: null // Explicitly set token to null for client-side cleanup
        });
    } catch (error) {
        next(error)
    }
};




const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }

        // Authorization check
        if (req.user?.id !== req.params.userId) {
            res.status(403).json({
                message: "You can only update your own account!"
            });
            return;
        }

        // Update fields
        if (req.body.fullName) user.fullName = req.body.fullName;
        if (req.body.email) user.email = req.body.email;
        if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

        // Only hash password if it's being updated
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        // If there's a file upload for profile picture
        if (req.file) {
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            user.profilePicture = imageUrl;
        }

        const updatedUser = await user.save();

        // Remove sensitive data before sending response
        const { password, __v, ...userDetails } = updatedUser.toObject();

        res.status(200).json({
            message: "User updated successfully",
            user: userDetails
        });

    } catch (error) {
        next(error);
    }
};


const DeleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Authorization check
        if (req.user?.id !== req.params.userId) {
            res.status(403).json({
                success: false,
                message: "You can only delete your own account!"
            });
            return;
        }

        // 2. Check if user exists before attempting deletion
        const existingUser = await User.findById(req.params.userId);
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        // 3. Perform deletion
        const deletedUser = await User.findByIdAndDelete(req.params.userId);

        // 4. Clear authentication cookies/tokens if needed
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: true, // Essential for HTTPS
            sameSite: 'none', // Required for cross-site usage
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            path: '/', // Accessible across all paths
            partitioned: true // Helps with ITP restrictions (iOS Safari)
        });

        // 5. Return success response
        res.status(200).json({
            success: true,
            token: null,
            message: "User deleted successfully",
            userId: deletedUser?._id
        });

    } catch (error) {
        // 6. Proper error handling
        console.error('Error deleting user:', error);
        return next(error);
    }
};




const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const GetUsers = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
        res.status(403).json({ message: "You are not allowed to see all users" })
        return
    }
    try {
        // Input validation
        const startIndex = Math.max(0, parseInt(req.query?.startIndex as string) || 0);
        const limit = Math.min(MAX_LIMIT, parseInt(req.query?.limit as string) || DEFAULT_LIMIT);
        const sortDirection = req.query?.sort === "asc" ? 1 : -1;

        // Query construction
        const query = User.find().select('-password');

        // Sorting and pagination
        const users = await query
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        // Counts
        const totalUsers = await User.countDocuments();

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            message: "Users fetched successfully",
            data: {
                users,
                pagination: {
                    total: totalUsers,
                    limit,
                    offset: startIndex
                },
                stats: {
                    lastMonth: lastMonthUsers
                }
            }
        });
    } catch (error) {
        next(error);
    }
};



const DeleteUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Authorization check - only admin can delete any user
        if (!req.user?.isAdmin) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action"
            });
            return;
        }

        // 2. Check if user exists before attempting deletion
        const existingUser = await User.findById(req.params.userId);
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        // 3. Prevent admin from deleting themselves (optional safety measure)
        if (req.user.id === req.params.userId) {
            res.status(403).json({
                success: false,
                message: "Admins cannot delete their own account with this endpoint"
            });
            return;
        }

        // 4. Perform deletion
        const deletedUser = await User.findByIdAndDelete(req.params.userId);

        // 5. Return success response
        res.status(200).json({
            success: true,
            message: "User deleted successfully by admin",
            userId: deletedUser?._id,
            deletedUserEmail: deletedUser?.email // Optionally include some user info
        });

    } catch (error) {
        // 6. Proper error handling
        console.error('Error deleting user:', error);
        return next(error);
    }
};



const uploadImage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
};


export default {
    Signout,
    UpdateUser,
    DeleteUser,
    GetUsers,
    DeleteUsers
};