import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyWorking: boolean;
  skills: string[];
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    isCurrentlyWorking: { type: Boolean, default: false },
    skills: [String],
    logo: String,
  },
  { timestamps: true }
);

export const Job =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
