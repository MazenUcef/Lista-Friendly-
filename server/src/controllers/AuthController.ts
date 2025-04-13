import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "@/modals/user.modal";

const Signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "Email already in use" });
            return
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        // Save user
        const savedUser = await newUser.save();

        // Remove password from response and convert to plain object
        const userObject = savedUser.toObject();
        const { password: _, ...userWithoutPassword } = userObject;

        // Return response
        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
        });

    } catch (error) {
        next(error)
    }
};

export default {
    Signup,
};