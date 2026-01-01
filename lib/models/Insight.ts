import mongoose, { Schema, Document } from "mongoose";

export interface IInsight extends Document {
  name: string;
  position: string;
  insight: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InsightSchema = new Schema<IInsight>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    insight: { type: String, required: true },
    image: String,
  },
  { timestamps: true }
);

export const Insight =
  mongoose.models.Insight || mongoose.model<IInsight>("Insight", InsightSchema);
