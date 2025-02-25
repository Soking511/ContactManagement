import { IContact } from "./contactInterface";
import { model, Schema } from "mongoose";

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    phone: { type: String, required: true, trim: true },
    notes: [
      {
        message: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<IContact>("Contact", contactSchema);
