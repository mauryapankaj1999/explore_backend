import { Schema, Types, model } from "mongoose";

export interface ITestimonial {
  name: string;
  packageName: string;
  packageId: Types.ObjectId;
  image: string;
  description: string;
  rating: number;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: String,
    packageName: String,
    packageId: Types.ObjectId,
    image: String,
    description: String,
    rating: Number,
  },
  {
    timestamps: true,
  },
);

export const Testimonial = model<ITestimonial>("testimonials", testimonialSchema);
