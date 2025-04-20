"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const verifyUser_1 = require("../utils/verifyUser");
const validation_1 = require("../middleware/validation");
const PostController_1 = __importDefault(require("../controllers/PostController"));
const FavoriteController_1 = __importDefault(require("../controllers/FavoriteController"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});
router.post('/create', verifyUser_1.verifyToken, exports.upload.single("brandPicture"), validation_1.validatePostCreation, PostController_1.default.createPost);
router.put('/update/:postId/:userId', verifyUser_1.verifyToken, exports.upload.single("brandPicture"), validation_1.validatePostCreation, PostController_1.default.updatePost);
router.get('/read', PostController_1.default.readPosts);
router.delete('/delete/:postId/:userId', verifyUser_1.verifyToken, PostController_1.default.deletePost);
router.post('/favorites/toggle', verifyUser_1.verifyToken, FavoriteController_1.default.toggleFavorite);
router.get('/favorites', verifyUser_1.verifyToken, FavoriteController_1.default.readdFavorites);
exports.default = router;
