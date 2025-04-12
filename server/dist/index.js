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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet")); // Added for security
const morgan_1 = __importDefault(require("morgan")); // Added for logging
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
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});
// Test endpoint with better typing
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Hello" });
}));
// Error handling middleware (should be after all routes)
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
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
