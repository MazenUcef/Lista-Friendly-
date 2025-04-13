import UserController from "@/controllers/UserController";
import express from "express";


const router = express.Router();

router.post("/signout", UserController.Signout)


export default router