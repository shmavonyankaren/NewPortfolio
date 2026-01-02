import mongoose, { Schema, Document } from "mongoose";

export interface ISkillset extends Document {
  title: string;
  skills: Array<{
    name: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const SkillsetSchema = new Schema<ISkillset>(
  {
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

export const Skillset =
  mongoose.models.Skillset ||
  mongoose.model<ISkillset>("Skillset", SkillsetSchema);
