import catchAsync from "../utils/catchAsync";
import User from "../model/userModal";
import Appointment from "../model/appointModal";

export const getAllAppoint = catchAsync(async( req, res, next) => {
    const appointments = await Appointment.find();
    res.status(201).json({
        status: "success",
        appointments
      });
})

export const postAppoint = catchAsync(async (req, res, next) => {
    const newAppointment = await Appointment.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            appointment: newAppointment
        }
    });
});