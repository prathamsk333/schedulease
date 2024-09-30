import mongoose, { Schema, Document } from "mongoose";

interface IParticipant extends Document {
  name: string;
  email: string;
  phone: string;
  userID: string;
}

interface IAppointment extends Document {
  token: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  title: string;
  desc: string;
  category: "education" | "health" | "work" | "personal";
  mode: "online" | "offline";
  location?: string;
  participants: IParticipant[];
}

const participantSchema = new Schema<IParticipant>({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  userID: {
    type: String,
  },
});

const appointmentSchema = new Schema<IAppointment>({
  token: {
    type: String,
    required: true,
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
  location: {
    type: String,
  },
  participants: [participantSchema],
});

const Appointment = mongoose.model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;