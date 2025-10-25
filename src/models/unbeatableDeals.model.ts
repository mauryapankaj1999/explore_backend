import { Schema, model } from "mongoose";

export interface IUnbeatableDeals {
  title: string; //Couple Tour | saving world wide | etc
  tagline: string; //4 Days in Switzerland | For Your First Book
  image: string;
  slug: string;
  offerPercentage: string;
  order: number; //order to display the deals.
}

const unbeatableDealsSchema = new Schema<IUnbeatableDeals>(
  {
    title: String,
    tagline: String,
    image: String,
    slug: String,
    offerPercentage: String,
    order: Number,
  },
  {
    timestamps: true,
  },
);

export const UnbeatableDeal = model<IUnbeatableDeals>("unbeatable_deals", unbeatableDealsSchema);
