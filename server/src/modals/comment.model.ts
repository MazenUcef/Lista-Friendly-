import mongoose, { Document, Schema } from "mongoose";

interface ICommentRating extends Document {
    postId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const CommentRatingSchema: Schema = new Schema(
    {
        postId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        userAvatar: {
            type: String
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

const Comment = mongoose.model<ICommentRating>('Comment', CommentRatingSchema);

export default Comment;