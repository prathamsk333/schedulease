import catchAsync from "../utils/catchAsync";
import User from "../model/userModal";
import Appointment from "../model/appointModal";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Participant from "../model/participantModal";

export const getAllAppoint = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(201).json({
    status: "success",
    appointments,
  });
});

export const postAppoint = catchAsync(async (req, res, next) => {
  const newAppointment = await Appointment.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      appointment: newAppointment,
    },
  });
});

export const deleteAppoint = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) {
    return res
      .status(404)
      .json({ status: "fail", message: "No appointment found with that ID" });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const addNewAppointments = catchAsync(async (req, res, next) => {
  const { token, appointment } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

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
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Failed to add new appointment" });
  }
});

export const listAppointments = async (req: Request, res: Response) => {
  try {
    const { token, filter } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

    const decoded: any = jwt.verify(token, JWT_SECRET);
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
    const participantEntries = await Participant.find({ userID:userId });
    const appointmentIds = participantEntries.map((p) => p.appointmentId);

    const appointments = await Appointment.find({
      _id: { $in: appointmentIds },
      date: { $gte: startDate, $lte: endDate },
    }).populate("participants");

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
