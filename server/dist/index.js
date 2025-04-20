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
require("./utils/paths");
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const AuthRoute_1 = __importDefault(require("./routes/AuthRoute"));
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
const PostsRoute_1 = __importDefault(require("./routes/PostsRoute"));
const FavsRoute_1 = __importDefault(require("./routes/FavsRoute"));
const CommentRoute_1 = __importDefault(require("./routes/CommentRoute"));
const cloudinary_1 = require("cloudinary");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Configuration validation
if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL environment variable is not defined');
}
if (!process.env.PORT) {
    throw new Error('PORT environment variable is not defined');
}
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // For form data
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)()); // Security headers
app.use((0, morgan_1.default)('dev')); // HTTP request logging
// CORS configuration (more secure)
// Update your allowed origins to include all necessary URLs
const allowedOrigins = [
    'http://localhost', // Production frontend
    'http://localhost:5173', // Vite dev server
    'http://localhost:5000' // Backend (if needed)
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Database connection
mongoose_1.default.set('strictQuery', false);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URL);
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection error:', error instanceof Error ? error.message : error);
        process.exit(1); // Exit process with failure
    }
});
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use('/api/auth', AuthRoute_1.default);
app.use('/api/user', UserRoute_1.default);
app.use('/api/post', PostsRoute_1.default);
app.use('/api/favorites', FavsRoute_1.default);
app.use('/api/comments', CommentRoute_1.default);
// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const clientPath = path_1.default.join(__dirname, '../../client/dist');
    app.use(express_1.default.static(clientPath));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(clientPath, 'index.html'));
    });
}
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});
// Test endpoint with better typing
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Hello" });
}));
// Error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
// Start server only after DB connection
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB();
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
startServer();
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
