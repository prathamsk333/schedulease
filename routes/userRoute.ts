import { Router } from "express";
import * as authController from "../controller/authController"; // Import controller functions

const router = Router();

router.post("/signup", authController.signup);
router.post('/login', authController.login);
router.get('/testRoute', authController.protect, authController.testroute);

export default router;
