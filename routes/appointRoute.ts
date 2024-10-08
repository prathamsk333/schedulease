import { Router } from "express";
import * as appointController from "../controller/appointController";

const router = Router();

router.post('/postAppoint', appointController.postAppoint)
router.get('/getAllAppoint', appointController.getAllAppoint)
router.delete('/deleteAppoint/:id', appointController.deleteAppoint)
router.get('/listAppointments', appointController.listAppointments) 
router.post('/addNewAppointments', appointController.addNewAppointments)

export default router;