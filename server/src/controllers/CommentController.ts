
import { NextFunction, Request, Response } from "express";
import Comment from "../modals/comment.model";
import User from "../modals/user.modal";

const AddComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId, rating, comment } = req.body;

        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return
        }

        // Fetch complete user details from database
        const user = await User.findById(req.user.id)
            .select('fullName profilePicture')
            .lean();

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        const newComment = new Comment({
            postId,
            userId: req.user.id, // Using the id from req.user
            userName: user.fullName,
            userAvatar: user.profilePicture,
            rating,
            comment
        });

        await newComment.save();

        res.status(201).json({
            message: 'Comment and rating added successfully',
            comment: newComment
        });
    } catch (error) {
        next(error);
    }
};

const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .exec();

        const totalCount = await Comment.countDocuments({ postId });
        res.json({
            comments,
            totalCount,
            totalPages: Math.ceil(totalCount / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error) {
        next(error);
    }
};


const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;


        if (!req.user || !req.user.id || !req.user.isAdmin) {
            res.status(403).json({
                message: 'Unauthorized - Admin privileges required'
            });
            return
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            res.status(404).json({ message: 'Comment not found' });
            return
        }

        res.status(200).json({
            message: 'Comment deleted successfully',
            comment: deletedComment
        });
    } catch (error) {
        next(error);
    }
};


const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const comments = await Comment.find()
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .exec();

        const totalCount = await Comment.countDocuments();

        res.json({
            comments,
            totalCount,
            totalPages: Math.ceil(totalCount / Number(limit)),
            currentPage: Number(page),
            limit: Number(limit)
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllComments,
    deleteComment,
    AddComment,
    getComments
};