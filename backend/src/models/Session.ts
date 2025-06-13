import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  userId: string;
  taskId?: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  type: "focus" | "break";
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: String, required: true },
    taskId: { type: String }, // optional link to task
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    type: { type: String, enum: ["focus", "break"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISession>("Session", SessionSchema);
