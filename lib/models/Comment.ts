import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  name: string;
  position: string;
  comment: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
