import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
