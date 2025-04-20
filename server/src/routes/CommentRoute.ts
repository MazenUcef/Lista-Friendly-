
import express from 'express';
import { verifyToken } from '../utils/verifyUser';
import { validateComment } from '../middleware/validation';
import CommentController from '../controllers/CommentController';



const router = express.Router();


router.post('/addComment', verifyToken, validateComment, CommentController.AddComment);
router.get('/getComments/:postId', verifyToken, CommentController.getComments);
router.delete('/deleteComments/:commentId', verifyToken, CommentController.deleteComment);
router.get('/getAllComments', verifyToken, CommentController.getAllComments);


export default router;