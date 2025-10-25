import { model, Schema } from "mongoose";

export interface ITestimonialHome {
  banner: string;
  title: string;
  tagline: string;
}

const testimonialHomeSchema = new Schema<ITestimonialHome>(
  {
    banner: String,
    title: String,
    tagline: String,
  },
  {
    timestamps: true,
  },
);

export const TestimonialHome = model<ITestimonialHome>("testimonial_homes", testimonialHomeSchema);
