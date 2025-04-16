import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "@/modals/user.modal";
import jwt from 'jsonwebtoken';

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


const Signin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        // 1. Find user (case-insensitive email)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            // 2. Generic error message for security
            res.status(401).json({ message: "Invalid credentials, Wrong email" });
            return
        }

        // 3. Password comparison
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials, Wrong password" });
            return
        }

        // 4. JWT token generation with expiration
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET as string,
        );

        // 6. Remove password before sending response
        const { password: userPassword, ...userWithoutPassword } = user.toObject();

        // 7. Secure cookie settings
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400000 // 1 day in ms
        }).status(200).json({
            user: userWithoutPassword,
            message: "Sign In successfully"
        });

    } catch (error) {
        next(error);
    }
}


const Google = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET as string);
            const { password: userPassword, ...userWithoutPassword } = user.toObject();
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400000 // 1 day in ms
            }).json({
                user: userWithoutPassword,
                message: "Sign In successfully"
            })
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                fullName: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            })
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET as string);
            const { password: userPassword, ...userWithoutPassword } = newUser.toObject();
            res.status(201).cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400000 // 1 day in ms
            }).json({
                user: userWithoutPassword,
                message: user ? 'Signed in successfully' : 'Account created and signed in'
            })
        }
    } catch (error) {
        next(error)
    }
}

export default {
    Signup,
    Signin,
    Google
};