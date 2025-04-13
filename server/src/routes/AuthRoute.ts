
import AuthController from "@/controllers/AuthController";
import { validateSignin, validateSignup } from "@/middleware/validation";
import express from "express"


const router = express.Router();


router.post("/signup", validateSignup, AuthController.Signup)
router.post("/signin", validateSignin, AuthController.Signin)
router.post("/google", AuthController.Google)


export default router