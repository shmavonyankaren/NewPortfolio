import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyWorking: boolean;
  skills: Array<{
    name: string;
    image?: string;
  }>;
  responsibilities: Array<{
    name: string;
  }>;
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
    skills: [
      {
        name: { type: String, required: true },
        image: String,
      },
    ],
    responsibilities: [
      {
        name: { type: String, required: true },
      },
    ],
    logo: String,
  },
  { timestamps: true }
);

export const Job =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
