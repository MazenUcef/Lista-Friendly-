
import AuthController from "@/controllers/AuthController";
import { validateSignup } from "@/middleware/validation";
import express from "express"


const router = express.Router();


router.post("/signup", validateSignup, AuthController.Signup)


export default router