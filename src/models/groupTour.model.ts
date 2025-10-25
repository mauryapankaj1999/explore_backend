import { Schema, model } from "mongoose";

export interface IGroupTour {
  banner: string;
  title: string;
  tagline: string;
  benefits: { title: string; tagline: string; image: string }[];
  status: boolean;
}

const groupTourSchema = new Schema<IGroupTour>(
  {
    banner: String,
    title: String,
    tagline: String,
    benefits: [
      {
        title: String,
        tagline: String,
        image: String,
      },
    ],
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const GroupTour = model<IGroupTour>("group_tours", groupTourSchema);
