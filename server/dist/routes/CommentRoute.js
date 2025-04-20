"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommentController_1 = __importDefault(require("@/controllers/CommentController"));
const validation_1 = require("@/middleware/validation");
const verifyUser_1 = require("@/utils/verifyUser");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/addComment', verifyUser_1.verifyToken, validation_1.validateComment, CommentController_1.default.AddComment);
router.get('/getComments/:postId', verifyUser_1.verifyToken, CommentController_1.default.getComments);
router.delete('/deleteComments/:commentId', verifyUser_1.verifyToken, CommentController_1.default.deleteComment);
router.get('/getAllComments', verifyUser_1.verifyToken, CommentController_1.default.getAllComments);
exports.default = router;
