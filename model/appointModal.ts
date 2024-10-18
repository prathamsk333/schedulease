import mongoose, { Schema, Document } from "mongoose";

interface IAppointment extends Document {
  token: string;
  date: Date;
  user: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  title: string;
  desc: string;
  category: "education" | "health" | "work" | "personal";
  mode: "online" | "offline";
  location?: string;
  image?: string;
  coordinates?: string;
  participants: mongoose.Schema.Types.ObjectId[];
}

const appointmentSchema = new Schema<IAppointment>({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["education", "health", "work", "personal"],
    required: true,
  },
  mode: {
    type: String,
    enum: ["online", "offline"],
    required: true,
  },  
  coordinates: {
    type: String,
  },
  location: {
    type: String,
  },
  image: {
    type: String,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    },
  ],
});

const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
);

export default Appointment;
