import type { Localized } from "../content/localization";
import { addLocalization } from "./localization";
import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document, Localized {
  order: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    order: { type: Number, min: 1, index: true, validate: Number.isInteger },
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

addLocalization(BlogPostSchema, "BlogPost");
if (mongoose.models.BlogPost && !mongoose.models.BlogPost.schema.path("translations")) mongoose.deleteModel("BlogPost");

// Next.js hot reload can retain a model compiled before these fields existed.
const cachedModel = mongoose.models.BlogPost;
if (cachedModel && (!cachedModel.schema.path("order"))) {
  mongoose.deleteModel("BlogPost");
}

export default mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
