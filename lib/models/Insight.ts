import type { Localized } from "../content/localization";
import { addLocalization } from "./localization";
import mongoose, { Schema, Document } from "mongoose";

export interface IInsight extends Document, Localized {
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

addLocalization(InsightSchema, "Insight");
if (mongoose.models.Insight && !mongoose.models.Insight.schema.path("translations")) mongoose.deleteModel("Insight");

// Next.js hot reload can retain a model compiled before these fields existed.
const cachedModel = mongoose.models.Insight;
if (cachedModel && (!cachedModel.schema.path("order"))) {
  mongoose.deleteModel("Insight");
}

export const Insight =
  mongoose.models.Insight || mongoose.model<IInsight>("Insight", InsightSchema);
