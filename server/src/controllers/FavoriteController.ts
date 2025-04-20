

import { NextFunction, Request, Response } from "express";
import Post from "../modals/post.modal";
import Favorite from "../modals/favorite.model";


const toggleFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return
        }

        const existingFavorite = await Favorite.findOne({ userId, postId });

        if (existingFavorite) {
            await Favorite.deleteOne({ _id: existingFavorite._id });
            res.status(200).json({
                success: true,
                message: "Removed from favorites",
                isFavorite: false
            });
            return
        } else {
            const newFavorite = new Favorite({ userId, postId });
            await newFavorite.save();
            res.status(200).json({
                success: true,
                message: "Added to favorites",
                isFavorite: true,
                post: post
            });
            return
        }
    } catch (error) {
        next(error);
    }
}




const readdFavorites = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        const { startIndex = '0', limit = '10' } = req.query;
        const parsedStartIndex = parseInt(startIndex as string);
        const parsedLimit = Math.min(parseInt(limit as string), 100); // Add max limit for safety

        // Find favorites and populate the full post details
        const favorites = await Favorite.find({ userId })
            .sort({ createdAt: -1 })
            .skip(parsedStartIndex)
            .limit(parsedLimit)
            .populate({
                path: 'postId',
                model: 'Post',
                select: '_id name description location category socialLinks brandPicture createdAt updatedAt'
            });

        const totalFavorites = await Favorite.countDocuments({ userId });

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
        return
    } catch (error) {
        next(error);
    }
}


export default {
    toggleFavorite,
    readdFavorites
}

