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
const cloudinary_1 = __importDefault(require("cloudinary"));
const user_modal_1 = __importDefault(require("@/modals/user.modal"));
const Signout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400000 // 1 day in ms
        }).status(200).json("User has been logged out successfully");
    }
    catch (error) {
        next(error);
    }
});
const UpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_modal_1.default.findById(req.params.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Authorization check
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== req.params.userId) {
            res.status(403).json({
                message: "You can only update your own account!"
            });
            return;
        }
        // Update fields
        if (req.body.fullName)
            user.fullName = req.body.fullName;
        if (req.body.email)
            user.email = req.body.email;
        if (req.body.profilePicture)
            user.profilePicture = req.body.profilePicture;
        // Only hash password if it's being updated
        if (req.body.password) {
            user.password = yield bcryptjs_1.default.hash(req.body.password, 10);
        }
        // If there's a file upload for profile picture
        if (req.file) {
            const imageUrl = yield uploadImage(req.file);
            user.profilePicture = imageUrl;
        }
        const updatedUser = yield user.save();
        // Remove sensitive data before sending response
        const _b = updatedUser.toObject(), { password, __v } = _b, userDetails = __rest(_b, ["password", "__v"]);
        res.status(200).json({
            message: "User updated successfully",
            user: userDetails
        });
    }
    catch (error) {
        next(error);
    }
});
const DeleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 1. Authorization check
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== req.params.userId) {
            res.status(403).json({
                success: false,
                message: "You can only delete your own account!"
            });
            return;
        }
        // 2. Check if user exists before attempting deletion
        const existingUser = yield user_modal_1.default.findById(req.params.userId);
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        // 3. Perform deletion
        const deletedUser = yield user_modal_1.default.findByIdAndDelete(req.params.userId);
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
            userId: deletedUser === null || deletedUser === void 0 ? void 0 : deletedUser._id
        });
    }
    catch (error) {
        // 6. Proper error handling
        console.error('Error deleting user:', error);
        return next(error);
    }
});
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = yield cloudinary_1.default.v2.uploader.upload(dataURI);
    return uploadResponse.url;
});
exports.default = {
    Signout,
    UpdateUser,
    DeleteUser
};
