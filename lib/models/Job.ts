import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  order: number;
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
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    order: { type: Number, min: 1, index: true, validate: Number.isInteger },
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
    logo: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Next.js hot reload can retain a model compiled before these fields existed.
const cachedModel = mongoose.models.Job;
if (cachedModel && (!cachedModel.schema.path("order") || cachedModel.schema.path("logo")?.options.required !== true)) {
  mongoose.deleteModel("Job");
}

export const Job =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
