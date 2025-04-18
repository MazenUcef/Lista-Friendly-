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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const favorite_model_1 = __importDefault(require("@/modals/favorite.model"));
const post_modal_1 = __importDefault(require("@/modals/post.modal"));
const toggleFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log(postId, userId);
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const post = yield post_modal_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const existingFavorite = yield favorite_model_1.default.findOne({ userId, postId });
        if (existingFavorite) {
            yield favorite_model_1.default.deleteOne({ _id: existingFavorite._id });
            res.status(200).json({
                success: true,
                message: "Removed from favorites",
                isFavorite: false
            });
            return;
        }
        else {
            const newFavorite = new favorite_model_1.default({ userId, postId });
            yield newFavorite.save();
            res.status(200).json({
                success: true,
                message: "Added to favorites",
                isFavorite: true,
                post: post
            });
            return;
        }
    }
    catch (error) {
        next(error);
    }
});
const readdFavorites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { startIndex = '0', limit = '10' } = req.query;
        const parsedStartIndex = parseInt(startIndex);
        const parsedLimit = Math.min(parseInt(limit), 100); // Add max limit for safety
        // Find favorites and populate the full post details
        const favorites = yield favorite_model_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .skip(parsedStartIndex)
            .limit(parsedLimit)
            .populate({
            path: 'postId',
            model: 'Post',
            select: '_id name description location category socialLinks brandPicture createdAt updatedAt'
        });
        const totalFavorites = yield favorite_model_1.default.countDocuments({ userId });
        // Extract the populated posts
        const likedPosts = favorites.map(fav => fav.postId).filter(post => post !== null);
        res.status(200).json({
            success: true,
            data: {
                posts: likedPosts, // Changed from 'favorites' to 'posts' for clarity
                pagination: {
                    total: totalFavorites,
                    currentPage: Math.floor(parsedStartIndex / parsedLimit) + 1,
                    totalPages: Math.ceil(totalFavorites / parsedLimit),
                    pageSize: parsedLimit
                }
            }
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    toggleFavorite,
    readdFavorites
};
