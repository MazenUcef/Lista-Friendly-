
import express from 'express';
import multer from 'multer';
import { verifyToken } from '../utils/verifyUser';
import { validatePostCreation } from '../middleware/validation';
import PostController from '../controllers/PostController';
import FavoriteController from '../controllers/FavoriteController';

const router = express.Router();

const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});

router.post('/create', verifyToken, upload.single("brandPicture"), validatePostCreation, PostController.createPost)
router.put('/update/:postId/:userId', verifyToken, upload.single("brandPicture"), validatePostCreation, PostController.updatePost)
router.get('/read', PostController.readPosts)
router.delete('/delete/:postId/:userId', verifyToken, PostController.deletePost)
router.post('/favorites/toggle', verifyToken, FavoriteController.toggleFavorite);
router.get('/favorites', verifyToken, FavoriteController.readdFavorites);






export default router;