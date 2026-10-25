import type { Localized } from "../content/localization";
import { addLocalization } from "./localization";
import mongoose, { Schema, Document } from "mongoose";

export interface IGeneralInfo extends Document, Localized {
  userPhoto?: string;
  fullName: string;
  shortAbout: string;
  fullDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const GeneralInfoSchema = new Schema<IGeneralInfo>(
  {
    userPhoto: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    shortAbout: {
      type: String,
      required: [true, "Short about is required"],
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
    },
  },
  { timestamps: true }
);

addLocalization(GeneralInfoSchema, "GeneralInfo");
if (mongoose.models.GeneralInfo && !mongoose.models.GeneralInfo.schema.path("translations")) mongoose.deleteModel("GeneralInfo");

export default mongoose.models.GeneralInfo ||
  mongoose.model<IGeneralInfo>("GeneralInfo", GeneralInfoSchema);
