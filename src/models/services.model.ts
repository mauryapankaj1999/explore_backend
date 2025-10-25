import { Schema, model } from "mongoose";

export interface IServices {
  title: string;
  image: string;
}

const serviceSchema = new Schema<IServices>(
  {
    title: String,
    image: String,
  },
  {
    timestamps: true,
  },
);

export const Services = model<IServices>("services", serviceSchema);
