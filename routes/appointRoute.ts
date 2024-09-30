import { Router } from "express";
import * as appointController from "../controller/appointController";

const router = Router();

router.post('/postAppoint', appointController.postAppoint)
router.get('/getAllAppoint', appointController.getAllAppoint)

export default router;