import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { 
    currentUser, 
    loginUser, 
    logoutUser, 
    registerUser 
} from "../controllers/user.controllers.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/current-user").get(verifyJWT,currentUser)
router.route("/logout").post(verifyJWT,logoutUser)

export default router;