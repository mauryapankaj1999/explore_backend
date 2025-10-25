import { Schema, model } from "mongoose";

export interface IMostViewedDestination {
  title: string;
  slug: string;
  image: string;
  tagline: string;
  url: string;
  order: any;
}

const mostViewedDestinationSchema = new Schema<IMostViewedDestination>(
  {
    title: String,
    slug: String,
    image: String,
    url: String,
    tagline: String,
    order: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  },
);

export const MostViewedDestination = model<IMostViewedDestination>(
  "most_viewed_destinations",
  mostViewedDestinationSchema,
);
