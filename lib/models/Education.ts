import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  institution: string;
  degree?: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  logo?: string;
  isCurrentlyStudying: boolean;
  skills: Array<{
    name: string;
    image?: string;
    description?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    institution: { type: String, required: true },
    degree: String,
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    description: { type: String, required: true },
    logo: String,
    isCurrentlyStudying: { type: Boolean, default: false },
    skills: {
      type: [
        {
          name: { type: String, required: true },
          image: String,
          description: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Education =
  mongoose.models.Education ||
  mongoose.model<IEducation>("Education", EducationSchema);
