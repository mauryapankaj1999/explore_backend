import { Schema, model } from "mongoose";

export interface ILanding {
  name: string;
  // email: string;
  // packageId?: string;
  // packageName?: string;
  mobile: string;
  destination: string;
  travelDate: Date;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  // message: string;
}

const landingSchema = new Schema<ILanding>(
  {
    name: String,
    // email: String,
    // packageId: String,
    // packageName: String,
    mobile: String,
    destination: String,
    travelDate: Date,
    // message: String,

    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    utm_term: String,
    utm_content: String,
    gclid: String,
  },
  {
    timestamps: true,
  },
);

export const Landing = model<ILanding>("landing", landingSchema);
