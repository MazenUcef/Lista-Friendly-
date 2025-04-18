"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_modal_1 = __importDefault(require("@/modals/user.modal"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield user_modal_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "Email already in use" });
            return;
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create new user
        const newUser = new user_modal_1.default({
            fullName,
            email,
            password: hashedPassword
        });
        // Save user
        const savedUser = yield newUser.save();
        // Remove password from response and convert to plain object
        const userObject = savedUser.toObject();
        const { password: _ } = userObject, userWithoutPassword = __rest(userObject, ["password"]);
        // Return response
        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        next(error);
    }
});
const Signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // 1. Find user (case-insensitive email)
        const user = yield user_modal_1.default.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            // 2. Generic error message for security
            res.status(401).json({ message: "Invalid credentials, Wrong email" });
            return;
        }
        // 3. Password comparison
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials, Wrong password" });
            return;
        }
        // 4. JWT token generation with expiration
        const token = jsonwebtoken_1.default.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        // 6. Remove password before sending response
        const _a = user.toObject(), { password: userPassword } = _a, userWithoutPassword = __rest(_a, ["password"]);
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
    }
    catch (error) {
        next(error);
    }
});
const Google = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = yield user_modal_1.default.findOne({ email });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const _a = user.toObject(), { password: userPassword } = _a, userWithoutPassword = __rest(_a, ["password"]);
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400000 // 1 day in ms
            }).json({
                user: userWithoutPassword,
                message: "Sign In successfully"
            });
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs_1.default.hashSync(generatedPassword, 10);
            const newUser = new user_modal_1.default({
                fullName: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            yield newUser.save();
            const token = jsonwebtoken_1.default.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const _b = newUser.toObject(), { password: userPassword } = _b, userWithoutPassword = __rest(_b, ["password"]);
            res.status(201).cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400000 // 1 day in ms
            }).json({
                user: userWithoutPassword,
                message: user ? 'Signed in successfully' : 'Account created and signed in'
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    Signup,
    Signin,
    Google
};
