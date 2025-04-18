import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import User from "@/modals/user.modal";

const Signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400000 // 1 day in ms
        }).status(200).json("User has been logged out successfully")
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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // 5. Return success response
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            userId: deletedUser?._id
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
    DeleteUser
};