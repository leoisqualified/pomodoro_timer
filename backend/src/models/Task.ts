import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  userId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: String, required: true }, // reference to the user
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
