import type { Localized } from "../content/localization";
import { addLocalization } from "./localization";
import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document, Localized {
  order: number;
  logo?: string;
  title: string;
  issuer: string;
  dateIssued: Date;
  description: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    logo: { type: String, default: "", trim: true },
    order: { type: Number, min: 1, index: true, validate: Number.isInteger },
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    dateIssued: { type: Date, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileName: String,
    fileType: String,
  },
  { timestamps: true }
);

addLocalization(CertificateSchema, "Certificate");
if (mongoose.models.Certificate && !mongoose.models.Certificate.schema.path("translations")) mongoose.deleteModel("Certificate");

// Next.js hot reload can retain a model compiled before these fields existed.
const cachedModel = mongoose.models.Certificate;
if (cachedModel && (!cachedModel.schema.path("order") || !cachedModel.schema.path("logo"))) {
  mongoose.deleteModel("Certificate");
}

export const Certificate =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);
