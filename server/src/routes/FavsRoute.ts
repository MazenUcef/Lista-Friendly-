import FavoriteController from '@/controllers/FavoriteController';
import { verifyToken } from '@/utils/verifyUser';
import express from 'express';


const router = express.Router();



router.post('/toggle', verifyToken, FavoriteController.toggleFavorite);
router.get('/read', verifyToken, FavoriteController.readdFavorites);






export default router;