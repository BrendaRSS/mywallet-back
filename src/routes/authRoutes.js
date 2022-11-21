import {postSignup, postSignin} from "../controllers/authController.js"
import {Router} from "express";

const router = Router();

router.post("/sign-up", postSignup);

router.post("/sign-in", postSignin);

export default router;