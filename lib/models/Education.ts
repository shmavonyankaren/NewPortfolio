import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  gpa?: number;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    description: { type: String, required: true },
    gpa: Number,
    logo: String,
  },
  { timestamps: true }
);

export const Education =
  mongoose.models.Education ||
  mongoose.model<IEducation>("Education", EducationSchema);
