import express from "express"
import { validateSignin, validateSignup } from "../middleware/validation";
import AuthController from "../controllers/AuthController";


const router = express.Router();


router.post("/signup", validateSignup, AuthController.Signup)
router.post("/signin", validateSignin, AuthController.Signin)
router.post("/google", AuthController.Google)


export default router