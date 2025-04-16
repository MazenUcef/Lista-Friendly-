import UserController from "@/controllers/UserController";
import { validateUpdate } from "@/middleware/validation";
import { verifyToken } from "@/utils/verifyUser";
import express from "express";
import multer from "multer";


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



export default router