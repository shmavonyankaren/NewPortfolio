import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
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

export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
