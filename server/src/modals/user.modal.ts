import mongoose from "mongoose"



const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw1PKok0yv-mzca642s84W8P&ust=1744650209109000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLC34NG-1YwDFQAAAAAdAAAAABAE"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }
);


const User = mongoose.model("User", userSchema);
export default User;