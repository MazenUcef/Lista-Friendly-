"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: 'uncategorized',
    },
    socialLinks: {
        type: [String],
        required: true,
    },
    brandPicture: {
        type: String,
        default: 'https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg',
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });
const Post = mongoose_1.default.model('Post', postSchema);
exports.default = Post;
