import { Router } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import * as appointController from "../controller/appointController";
import * as authController from "../controller/authController";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/postAppoint",
  upload.single("image"),
  authController.protect,
  appointController.postAppoint
);

router.get(
  "/getAllAppoint",
  authController.protect,
  appointController.getAllAppoint
);

router.get(
  "/getOneAppointment/:id",
  authController.protect,
  appointController.getOneAppointment
);

router.delete(
  "/deleteAppoint/:id",
  authController.protect,
  appointController.deleteAppoint
);

router.get( 
  "/listAppointments/:filter",
  authController.protect,
  appointController.listAppointments
);

router.post(
  "/addNewAppointments",
  authController.protect,
  appointController.addNewAppointments
);

router.get(
  "/listAppointmentsCreated",
  authController.protect,
  appointController.listAppointmentsCreated
);

export default router;
