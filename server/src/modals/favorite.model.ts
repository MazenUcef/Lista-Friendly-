import mongoose, { Document, Schema } from "mongoose";

export interface IFavorite extends Document {
    userId: string;
    postId: string;
    createdAt: Date;
}


const favoriteSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    postId: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', favoriteSchema);

export default Favorite;
