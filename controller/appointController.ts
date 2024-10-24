import catchAsync from "../utils/catchAsync";
import Appointment from "../model/appointModal";
import { Request, Response } from "express";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Participant from "../model/participantModal";
import mongoose from "mongoose";
import User from "../model/userModal";

dotenv.config({ path: "./config.env" });

const randomImageName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

interface AuthenticatedRequest extends Request {
  user?: {
    token: string;
    _id: string;
  };
}

const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if (!accessKey || !secretAccessKey) {
  throw new Error("AWS credentials are not defined");
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: process.env.AWS_REGION,
});

export const getAllAppoint = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(201).json({
    status: "success",
    appointments,
  });
});

export const postAppoint = catchAsync(async (req, res, next) => {
  req.body.token = (req as AuthenticatedRequest).user?.token;

  const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

  const decoded: any = jwt.verify(req.body.token, JWT_SECRET);
  const userId = decoded.id;
  req.body.user = userId;

  const imageName = randomImageName();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: imageName,
    Body: req.file?.buffer,
    ContentType: req.file?.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
  const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
  req.body.image = imageUrl;

  const newAppointment = await Appointment.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      appointment: newAppointment,
    },
  });
});

export const deleteAppoint = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id.toString();
    const appointmentId = new mongoose.Types.ObjectId(req.params.id);
    console.log(appointmentId);
    console.log(userId);
    const appointment = await Appointment.findOneAndDelete({
      user: userId,
      _id: appointmentId,
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ status: "fail", message: "No appointment found with that ID" });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const addNewAppointments = catchAsync(async (req, res) => {
  const { appointment } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
  const token = (req as AuthenticatedRequest).user?.token;

  if (!token) {
    return res.status(400).json({ message: "Token must be provided" });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    await Participant.create({ userID: userId, appointmentId: appointment });
    res.status(201).json({
      status: "success",
      data: {
        appointment,
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.name === "JsonWebTokenError") {
    }
    return res.status(500).json({ message: "Failed to add new appointment" });
  }
});

export const listAppointments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { filter } = req.params;
    const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

    const token = req.user?.token;

    console.log(req.user);

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const decoded: any = jwt.verify(req.user.token, JWT_SECRET);
    const userId = decoded.id;

    const today = new Date();
    let startDate: Date, endDate: Date;

    if (filter === "today") {
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date(today.setHours(23, 59, 59, 999));
    } else if (filter === "week") {
      const weekStart = today.getDate() - today.getDay();
      startDate = new Date(today.setDate(weekStart));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (filter === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (filter === "all") {
      startDate = new Date("1970-01-01");
      endDate = new Date("9999-12-31");
    } else {
      return res.status(400).json({ message: "Invalid filter value" });
    }
    const participantEntries = await Participant.find({ userID: userId });
    const appointmentIds = participantEntries.map((p) => p.appointmentId);

    const appointments = await Appointment.find({
      _id: { $in: appointmentIds },
      date: { $gte: startDate, $lte: endDate },
    }).populate("participants");
    console.log(appointments);
    return res.status(200).json({
      status: "success",
      appointments,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const getOneAppointment = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const appoint = await Appointment.findById(req.params.id); // Changed to findById for clarity

    if (!appoint) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment not found",
      });
    }
    
    const participants = await Participant.find({
      appointmentId: req.params.id,
    });

    const users = await User.find({
      _id: { $in: participants.map((p) => p.userID) },
    });

    const participantDetails = users.map((u) => ({
      name: u.name,
      email: u.email,
      phone: u.phone,
    }));

    res.status(200).json({
      status: "success",
      data: {
        appoint,
        participants: participantDetails,
      },
    });
  }
);

export const listAppointmentsCreated = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    console.log(req.user?._id);
    const appointCreated = await Appointment.find({ user: req.user?._id });

    res.status(200).json({
      status: "success",
      data: {
        appointCreated,
      },
    });
  }
);
