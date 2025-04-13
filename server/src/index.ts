import './utils/paths';
import 'module-alias/register';
import express, { Request, Response, Application, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import mongoose from 'mongoose';
import helmet from 'helmet'; // Added for security
import morgan from 'morgan'; // Added for logging
import authRoutes from './routes/AuthRoute'; // Added for logging
import userRoutes from './routes/UserRoute'; // Added for logging

const app: Application = express();

// Configuration validation
if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL environment variable is not defined');
}

if (!process.env.PORT) {
    throw new Error('PORT environment variable is not defined');
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // HTTP request logging

// CORS configuration (more secure)
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database connection
mongoose.set('strictQuery', false);

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error instanceof Error ? error.message : error);
        process.exit(1); // Exit process with failure
    }
};

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP' });
});

// Test endpoint with better typing
app.get("/test", async (req: Request, res: Response<{ message: string }>) => {
    res.json({ message: "Hello" });
});

// Error handling middleware (should be after all routes)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

interface CustomError extends Error {
    statusCode?: number;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

// Start server only after DB connection
const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});