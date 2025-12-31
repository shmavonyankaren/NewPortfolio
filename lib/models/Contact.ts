import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  github?: string;
  twitter?: string;
  website?: string;
  cvUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    linkedIn: String,
    github: String,
    twitter: String,
    website: String,
    cvUrl: String,
  },
  { timestamps: true }
);

export const Contact =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
