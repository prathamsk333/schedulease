import { Router } from "express";
import * as authController from "../controller/authController"; // Import controller functions

const router = Router();

router.post("/signup", authController.signup);
router.post('/login', authController.login);
router.post('/resetPassword', authController.forgotPassword);
router.patch('/newPassword/:token', authController.resetPassword);

export default router;
    