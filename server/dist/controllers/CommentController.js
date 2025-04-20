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
const comment_model_1 = __importDefault(require("../modals/comment.model"));
const user_modal_1 = __importDefault(require("../modals/user.modal"));
const AddComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, rating, comment } = req.body;
        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Fetch complete user details from database
        const user = yield user_modal_1.default.findById(req.user.id)
            .select('fullName profilePicture')
            .lean();
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const newComment = new comment_model_1.default({
            postId,
            userId: req.user.id, // Using the id from req.user
            userName: user.fullName,
            userAvatar: user.profilePicture,
            rating,
            comment
        });
        yield newComment.save();
        res.status(201).json({
            message: 'Comment and rating added successfully',
            comment: newComment
        });
    }
    catch (error) {
        next(error);
    }
});
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const comments = yield comment_model_1.default.find({ postId })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .exec();
        const totalCount = yield comment_model_1.default.countDocuments({ postId });
        res.json({
            comments,
            totalCount,
            totalPages: Math.ceil(totalCount / Number(limit)),
            currentPage: Number(page)
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        if (!req.user || !req.user.id || !req.user.isAdmin) {
            res.status(403).json({
                message: 'Unauthorized - Admin privileges required'
            });
            return;
        }
        const deletedComment = yield comment_model_1.default.findByIdAndDelete(commentId);
        if (!deletedComment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        res.status(200).json({
            message: 'Comment deleted successfully',
            comment: deletedComment
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 20 } = req.query;
        const comments = yield comment_model_1.default.find()
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .exec();
        const totalCount = yield comment_model_1.default.countDocuments();
        res.json({
            comments,
            totalCount,
            totalPages: Math.ceil(totalCount / Number(limit)),
            currentPage: Number(page),
            limit: Number(limit)
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllComments,
    deleteComment,
    AddComment,
    getComments
};
