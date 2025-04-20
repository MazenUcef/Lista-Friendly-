
import express from "express";
import multer from "multer";
import UserController from "../controllers/UserController";
import { verifyToken } from "../utils/verifyUser";
import { validateUpdate } from "../middleware/validation";


const router = express.Router();



const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});

router.post("/signout", UserController.Signout)
router.put("/update/:userId", verifyToken, upload.single("profilePicture"), validateUpdate, UserController.UpdateUser)
router.delete("/delete/:userId", verifyToken, UserController.DeleteUser)
router.get('/getUser', verifyToken, UserController.GetUsers)
router.delete('/admin-delete/:userId', verifyToken, UserController.DeleteUsers);


export default router