import mongoose from 'mongoose';
import { IContact } from './contactInterface';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IContact>("Contact", contactSchema);
