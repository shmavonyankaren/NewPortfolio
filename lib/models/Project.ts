import type { Localized } from "../content/localization";
import { addLocalization } from "./localization";
import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document, Localized {
  order: number;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  technologies: { name: string; icon?: string }[];
  features: { title: string; description: string }[];
  challenges: { challenge: string; solution: string }[];
  demoUrl?: string;
  githubUrl?: string;
  duration: string;
  teamType: "solo" | "team";
  status: "Live & Maintained" | "In Development" | "Planned";
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    order: { type: Number, min: 1, index: true, validate: Number.isInteger },
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    image: { type: String, required: true },
    technologies: [
      {
        name: String,
        icon: String,
      },
    ],
    features: [
      {
        title: String,
        description: String,
      },
    ],
    challenges: [
      {
        challenge: String,
        solution: String,
      },
    ],
    demoUrl: String,
    githubUrl: String,
    duration: String,
    teamType: {
      type: String,
      enum: ["solo", "team"],
      default: "solo",
    },
    status: {
      type: String,
      enum: ["Live & Maintained", "In Development", "Planned"],
      default: "Live & Maintained",
    },
  },
  { timestamps: true }
);

addLocalization(ProjectSchema, "Project");
if (mongoose.models.Project && !mongoose.models.Project.schema.path("translations")) mongoose.deleteModel("Project");

// Next.js hot reload can retain a model compiled before these fields existed.
const cachedModel = mongoose.models.Project;
if (cachedModel && (!cachedModel.schema.path("order"))) {
  mongoose.deleteModel("Project");
}

export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
