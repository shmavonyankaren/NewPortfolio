import type { Localized } from "../content/localization";
import { addLocalization } from "./localization";
import mongoose, { Schema, Document } from "mongoose";

export interface ISkillset extends Document, Localized {
  order: number;
  image: string;
  /** Retained for old records; the UI uses image. */
  emoji: string;
  title: string;
  skills: Array<{
    name: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const SkillsetSchema = new Schema<ISkillset>(
  {
    image: { type: String, required: true, trim: true },
    emoji: { type: String, default: "", trim: true },
    order: { type: Number, min: 1, index: true, validate: Number.isInteger },
    title: { type: String, required: true },
    skills: {
      type: [
        {
          name: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

addLocalization(SkillsetSchema, "Skillset");
if (mongoose.models.Skillset && !mongoose.models.Skillset.schema.path("translations")) mongoose.deleteModel("Skillset");

// Next.js hot reload can retain a model compiled before these fields existed.
const cachedModel = mongoose.models.Skillset;
if (cachedModel && (!cachedModel.schema.path("order") || !cachedModel.schema.path("emoji") || !cachedModel.schema.path("image"))) {
  mongoose.deleteModel("Skillset");
}

export const Skillset =
  mongoose.models.Skillset ||
  mongoose.model<ISkillset>("Skillset", SkillsetSchema);
