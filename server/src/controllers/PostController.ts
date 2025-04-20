
import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Post from "../modals/post.modal";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Authorization check
        if (!req.user?.isAdmin) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to create posts!"
            });
            return
        }

        // Generate slug
        const slug = req.body.name
            .split(' ')
            .join('-')
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, '');

        // Handle image upload if exists
        let brandPictureUrl = req.body.brandPicture ||
            'https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg';

        if (req.file) {
            brandPictureUrl = await uploadImage(req.file as Express.Multer.File);
        }

        // Create new post
        const newPost = new Post({
            userId: req.user?.id,
            name: req.body.name,
            category: req.body.category || 'uncategorized',
            description: req.body.description,
            location: req.body.location,
            socialLinks: req.body.socialLinks,
            brandPicture: brandPictureUrl,
            slug
        });

        // Save to database
        const savedPost = await newPost.save();

        // Prepare response (remove unnecessary fields if needed)
        const { __v, ...postDetails } = savedPost.toObject();

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: postDetails
        });

    } catch (error: any) {
        if (error.code === 11000 && error.keyPattern?.slug) {
            res.status(400).json({
                success: false,
                message: "A post with this name already exists (slug conflict)"
            });
            return
        }
        next(error);
    }
};


const readPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate and parse query parameters
        const {
            userId,
            category,
            slug,
            postId,
            searchTerm,
            startIndex = '0',
            limit = '10',
            order = 'desc'
        } = req.query;

        const parsedStartIndex = parseInt(startIndex as string);
        const parsedLimit = Math.min(parseInt(limit as string), 100); // Enforce max limit
        const sortDirection = order === 'asc' ? 1 : -1;

        // Input validation
        if (isNaN(parsedStartIndex) || isNaN(parsedLimit)) {
            res.status(400).json({
                success: false,
                message: "Invalid pagination parameters"
            });
            return
        }

        // Build query
        const query: any = {};

        if (userId) query.userId = userId;
        if (category) query.category = category;
        if (slug) query.slug = slug;
        if (postId) {
            if (!mongoose.Types.ObjectId.isValid(postId as string)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid post ID format"
                });
                return
            }
            query._id = postId;
        }

        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm as string, $options: 'i' } },
                { description: { $regex: searchTerm as string, $options: 'i' } },
                { location: { $regex: searchTerm as string, $options: 'i' } }
            ];
        }

        // Execute queries in parallel
        const [posts, totalPosts, lastMonth] = await Promise.all([
            Post.find(query)
                .sort({ updatedAt: sortDirection })
                .skip(parsedStartIndex)
                .limit(parsedLimit)
                .lean(), // Use lean() for better performance

            Post.countDocuments(query),

            Post.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                },
                ...query // Apply the same filters to lastMonth count
            })
        ]);

        res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            data: { // Nest the response data
                posts,
                pagination: {
                    total: totalPosts,
                    lastMonth,
                    currentPage: Math.floor(parsedStartIndex / parsedLimit) + 1,
                    totalPages: Math.ceil(totalPosts / parsedLimit),
                    pageSize: parsedLimit
                }
            }
        });

    } catch (error) {
        next(error);
    }
};


const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const { postId, userId } = req.params;

    // 2. Authorization - more explicit separation
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
        return
    }

    if (!req.user.isAdmin && req.user.id !== userId) {
        res.status(403).json({
            success: false,
            message: "Unauthorized - You can only delete your own posts unless you're an admin"
        });
        return
    }

    try {
        // 3. Check if post exists first
        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({
                success: false,
                message: "Post not found"
            });
            return
        }

        // 4. Verify post ownership if not admin
        if (!req.user.isAdmin && post.userId.toString() !== req.user.id) {
            res.status(403).json({
                success: false,
                message: "Unauthorized - This post doesn't belong to you"
            });
            return
        }

        // 5. Perform deletion
        await Post.findByIdAndDelete(postId);

        // 7. Success response
        res.status(204).json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}



const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId, userId } = req.params;

        // Authorization check - user must be authenticated
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
            return
        }

        // Check if the requesting user matches the userId parameter or is admin
        if (req.user.id !== userId && !req.user.isAdmin) {
            res.status(403).json({
                success: false,
                message: "Unauthorized - You can only update your own posts"
            });
            return
        }

        // Check if post exists
        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            res.status(404).json({
                success: false,
                message: "Post not found"
            });
            return
        }

        // Verify post ownership if not admin
        if (!req.user.isAdmin && existingPost.userId.toString() !== req.user.id) {
            res.status(403).json({
                success: false,
                message: "Unauthorized - This post doesn't belong to you"
            });
            return
        }

        // Handle image upload if exists
        let brandPictureUrl = existingPost.brandPicture;
        if (req.file) {
            brandPictureUrl = await uploadImage(req.file as Express.Multer.File);
        }

        // Prepare update data
        const updateData: any = {
            ...req.body,
            brandPicture: brandPictureUrl
        };

        // Generate new slug if name is being updated
        if (req.body.name) {
            const slug = req.body.name
                .split(' ')
                .join('-')
                .toLowerCase()
                .replace(/[^a-zA-Z0-9-]/g, '');
            updateData.slug = slug;
        }

        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: updateData },
            { new: true }
        ).select('-__v'); // Exclude __v field

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost
        });

    } catch (error: any) {
        if (error.code === 11000 && error.keyPattern?.slug) {
            res.status(400).json({
                success: false,
                message: "A post with this name already exists"
            });
            return
        }
        next(error);
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
    createPost,
    readPosts,
    deletePost,
    updatePost
};