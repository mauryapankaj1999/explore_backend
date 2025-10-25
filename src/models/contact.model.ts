import { Schema, model } from "mongoose";

export interface IContactUs {
  name: string;
  // email: string;
  // packageId?: string;
  // packageName?: string;
  mobile: string;
  destination: string;
  travelDate: Date;
  isDeleted: boolean;

  // message: string;
}

const contactSchema = new Schema<IContactUs>(
  {
    name: String,
    // email: String,
    // packageId: String,
    // packageName: String,
    mobile: String,
    destination: String,
    travelDate: Date,
    isDeleted: { type: Boolean, default: false },
    // message: String,
  },
  {
    timestamps: true,
  },
);

export const ContactUs = model<IContactUs>("contacts", contactSchema);
