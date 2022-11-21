import {postSignup, postSignin} from "../controllers/authController.js"
import {Router} from "express";
import {validationSignUpMeddleware} from "../middlewares/validationSignUpMeddleware.js";
import {validationSignInMeddleware} from "../middlewares/validationSignInMeddleware.js";

const router = Router();

router.post("/sign-up", validationSignUpMeddleware, postSignup);

router.post("/sign-in", validationSignInMeddleware, postSignin);

export default router;