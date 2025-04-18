"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = __importDefault(require("@/controllers/AuthController"));
const validation_1 = require("@/middleware/validation");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/signup", validation_1.validateSignup, AuthController_1.default.Signup);
router.post("/signin", validation_1.validateSignin, AuthController_1.default.Signin);
router.post("/google", AuthController_1.default.Google);
exports.default = router;
