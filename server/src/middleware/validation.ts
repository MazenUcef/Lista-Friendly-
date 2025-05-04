import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; // Explicitly return void
    }
    next();
};




export const validateSignup: RequestHandler[] = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    handleValidationErrors
];
export const validateUpdate: RequestHandler[] = [
    body('fullName')
        .optional() // Make all fields optional
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),

    body('email')
        .optional()
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .optional() // This is crucial
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

    handleValidationErrors
];


export const validateSignin: RequestHandler[] = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    handleValidationErrors
];


export const validatePostCreation: RequestHandler[] = [
    body('name')
        .trim()
        .notEmpty().withMessage('Brand name is required')
        .isLength({ min: 2 }).withMessage('Brand name must be at least 2 characters')
        .isString().withMessage('Brand name must be a string'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
        .isString().withMessage('Description must be a string'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isString().withMessage('Location must be a string'),

    body('socialLinks')
        .trim()
        .notEmpty().withMessage('Social Link is required'),

    body('brandPicture')
        .optional()
        .isURL().withMessage('Brand picture must be a valid URL'),
    handleValidationErrors
];

export const validatePostUpdate: RequestHandler[] = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Brand name must be at least 2 characters')
        .isString().withMessage('Brand name must be a string'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
        .isString().withMessage('Description must be a string'),

    body('location')
        .optional()
        .trim()
        .isString().withMessage('Location must be a string'),

    body('socialLinks')
        .optional()
        .isArray().withMessage('Social links must be an array')
        .custom((links: string[]) => {
            if (links && links.length > 0) {
                const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                return links.every(link => urlRegex.test(link));
            }
            return true;
        }).withMessage('Social links must be valid URLs'),

    body('brandPicture')
        .optional()
        .isURL().withMessage('Brand picture must be a valid URL'),
    handleValidationErrors
];


export const validateComment: RequestHandler[] = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),

    body('comment')
        .notEmpty().withMessage('Comment is required'),
    handleValidationErrors
];