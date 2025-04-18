"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostUpdate = exports.validatePostCreation = exports.validateSignin = exports.validateUpdate = exports.validateSignup = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; // Explicitly return void
    }
    next();
};
exports.validateSignup = [
    (0, express_validator_1.body)('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    handleValidationErrors
];
exports.validateUpdate = [
    (0, express_validator_1.body)('fullName')
        .optional() // Make all fields optional
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .optional() // This is crucial
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    handleValidationErrors
];
exports.validateSignin = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    handleValidationErrors
];
exports.validatePostCreation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('Brand name is required')
        .isLength({ min: 2 }).withMessage('Brand name must be at least 2 characters')
        .isString().withMessage('Brand name must be a string'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
        .isString().withMessage('Description must be a string'),
    (0, express_validator_1.body)('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isString().withMessage('Location must be a string'),
    (0, express_validator_1.body)('socialLinks')
        .custom((value) => {
        // Handle both stringified array and actual array
        let links;
        if (typeof value === 'string') {
            try {
                links = JSON.parse(value);
            }
            catch (_a) {
                links = [value]; // Fallback to single URL
            }
        }
        else if (Array.isArray(value)) {
            links = value;
        }
        else {
            return false;
        }
        // Filter out empty strings
        links = links.filter(link => link && link.trim());
        if (links.length === 0)
            return false;
        const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
        return links.every(link => urlRegex.test(link));
    })
        .withMessage('Provide at least one valid URL (include http:// or https://)'),
    (0, express_validator_1.body)('brandPicture')
        .optional()
        .isURL().withMessage('Brand picture must be a valid URL'),
    handleValidationErrors
];
exports.validatePostUpdate = [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Brand name must be at least 2 characters')
        .isString().withMessage('Brand name must be a string'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
        .isString().withMessage('Description must be a string'),
    (0, express_validator_1.body)('location')
        .optional()
        .trim()
        .isString().withMessage('Location must be a string'),
    (0, express_validator_1.body)('socialLinks')
        .optional()
        .isArray().withMessage('Social links must be an array')
        .custom((links) => {
        if (links && links.length > 0) {
            const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            return links.every(link => urlRegex.test(link));
        }
        return true;
    }).withMessage('Social links must be valid URLs'),
    (0, express_validator_1.body)('brandPicture')
        .optional()
        .isURL().withMessage('Brand picture must be a valid URL'),
    handleValidationErrors
];
