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
const post_modal_1 = __importDefault(require("@/modals/post.modal"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Authorization check
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to create posts!"
            });
            return;
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
            brandPictureUrl = yield uploadImage(req.file);
        }
        // Create new post
        const newPost = new post_modal_1.default({
            userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            name: req.body.name,
            category: req.body.category || 'uncategorized',
            description: req.body.description,
            location: req.body.location,
            socialLinks: req.body.socialLinks,
            brandPicture: brandPictureUrl,
            slug
        });
        // Save to database
        const savedPost = yield newPost.save();
        // Prepare response (remove unnecessary fields if needed)
        const _d = savedPost.toObject(), { __v } = _d, postDetails = __rest(_d, ["__v"]);
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: postDetails
        });
    }
    catch (error) {
        if (error.code === 11000 && ((_c = error.keyPattern) === null || _c === void 0 ? void 0 : _c.slug)) {
            res.status(400).json({
                success: false,
                message: "A post with this name already exists (slug conflict)"
            });
            return;
        }
        next(error);
    }
});
const readPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate and parse query parameters
        const { userId, category, slug, postId, searchTerm, startIndex = '0', limit = '10', order = 'desc' } = req.query;
        const parsedStartIndex = parseInt(startIndex);
        const parsedLimit = Math.min(parseInt(limit), 100); // Enforce max limit
        const sortDirection = order === 'asc' ? 1 : -1;
        // Input validation
        if (isNaN(parsedStartIndex) || isNaN(parsedLimit)) {
            res.status(400).json({
                success: false,
                message: "Invalid pagination parameters"
            });
            return;
        }
        // Build query
        const query = {};
        if (userId)
            query.userId = userId;
        if (category)
            query.category = category;
        if (slug)
            query.slug = slug;
        if (postId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid post ID format"
                });
                return;
            }
            query._id = postId;
        }
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { location: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        // Execute queries in parallel
        const [posts, totalPosts, lastMonth] = yield Promise.all([
            post_modal_1.default.find(query)
                .sort({ updatedAt: sortDirection })
                .skip(parsedStartIndex)
                .limit(parsedLimit)
                .lean(), // Use lean() for better performance
            post_modal_1.default.countDocuments(query),
            post_modal_1.default.countDocuments(Object.assign({ createdAt: {
                    $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                } }, query // Apply the same filters to lastMonth count
            ))
        ]);
        res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            data: {
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
    }
    catch (error) {
        next(error);
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
    createPost,
    readPosts
};
