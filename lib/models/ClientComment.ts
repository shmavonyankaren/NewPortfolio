import mongoose, { Schema, Document } from "mongoose";

export interface IClientComment extends Document {
  clientName: string;
  company: string;
  comment: string;
  rating: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientCommentSchema = new Schema<IClientComment>(
  {
    clientName: { type: String, required: true },
    company: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    image: String,
  },
  { timestamps: true }
);

export const ClientComment =
  mongoose.models.ClientComment ||
  mongoose.model<IClientComment>("ClientComment", ClientCommentSchema);
