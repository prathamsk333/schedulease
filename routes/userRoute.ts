import { Router } from "express";
import * as authController from "../controller/authController"; // Import controller functions
import * as userController from "../controller/userController";

const router = Router();

router.post("/signup", authController.signup);
router.post('/login', authController.login);
router.post('/resetPassword', authController.forgotPassword);
router.patch('/newPassword/:token', authController.resetPassword);
router.patch('/updateMe', authController.protect, userController.updateUser);

export default router;
    