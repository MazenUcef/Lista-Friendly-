
import express from 'express';
import { verifyToken } from '../utils/verifyUser';
import FavoriteController from '../controllers/FavoriteController';


const router = express.Router();



router.post('/toggle', verifyToken, FavoriteController.toggleFavorite);
router.get('/read', verifyToken, FavoriteController.readdFavorites);






export default router;