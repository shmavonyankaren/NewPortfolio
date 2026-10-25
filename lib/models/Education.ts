import type { Localized } from "../content/localization";
import { addLocalization } from "./localization";
import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document, Localized {
  order: number;
  institution: string;
  degree?: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  logo: string;
  isCurrentlyStudying: boolean;
  skills: Array<{
    name: string;
    image?: string;
    description?: string;
  }>;
  learningOutcomes: string[];
  outcomeItems?: import("../content/localization").OutcomeItem[];
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    order: { type: Number, min: 1, index: true, validate: Number.isInteger },
    institution: { type: String, required: true },
    degree: String,
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    description: { type: String, required: true },
    logo: { type: String, required: true, trim: true },
    isCurrentlyStudying: { type: Boolean, default: false },
    learningOutcomes: { type: [String], default: [] },
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

addLocalization(EducationSchema, "Education");
if (mongoose.models.Education && !mongoose.models.Education.schema.path("translations")) mongoose.deleteModel("Education");

// Next.js hot reload can retain a model compiled before these fields existed.
const cachedModel = mongoose.models.Education;
if (cachedModel && (!cachedModel.schema.path("learningOutcomes") || !cachedModel.schema.path("order") || cachedModel.schema.path("logo")?.options.required !== true)) {
  mongoose.deleteModel("Education");
}

export const Education =
  mongoose.models.Education ||
  mongoose.model<IEducation>("Education", EducationSchema);
