import { Router } from "express";
import * as appointController from "../controller/appointController";
import * as authController from '../controller/authController'

const router = Router();

router.post('/postAppoint',authController.protect, appointController.postAppoint)
router.get('/getAllAppoint',authController.protect, appointController.getAllAppoint)
router.delete('/deleteAppoint/:id',authController.protect, appointController.deleteAppoint)
router.get('/listAppointments/:filter',authController.protect,appointController.listAppointments) 
router.post('/addNewAppointments',authController.protect, appointController.addNewAppointments)

export default router;      