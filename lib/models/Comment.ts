import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  order: number;
  name: string;
  position: string;
  comment: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    order: { type: Number, min: 1, index: true, validate: Number.isInteger },
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

// Next.js hot reload can retain a model compiled before these fields existed.
const cachedModel = mongoose.models.Comment;
if (cachedModel && (!cachedModel.schema.path("order"))) {
  mongoose.deleteModel("Comment");
}

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
