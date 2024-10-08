import mongoose, { Schema, Document } from "mongoose";

export interface IParticipant extends Document {
  userID: mongoose.Schema.Types.ObjectId;
  appointmentId: mongoose.Schema.Types.ObjectId;
}

const participantSchema = new Schema<IParticipant>(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<IParticipant>("Participant", participantSchema);
