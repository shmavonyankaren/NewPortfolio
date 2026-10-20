import mongoose, { Schema, Document } from "mongoose";

export interface IInsight extends Document {
  order: number;
  name: string;
  position: string;
  insight: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InsightSchema = new Schema<IInsight>(
  {
    order: { type: Number, min: 1, index: true, validate: Number.isInteger },
    name: { type: String, required: true },
    position: { type: String, required: true },
    insight: { type: String, required: true },
    image: String,
  },
  { timestamps: true }
);

// Next.js hot reload can retain a model compiled before these fields existed.
const cachedModel = mongoose.models.Insight;
if (cachedModel && (!cachedModel.schema.path("order"))) {
  mongoose.deleteModel("Insight");
}

export const Insight =
  mongoose.models.Insight || mongoose.model<IInsight>("Insight", InsightSchema);
