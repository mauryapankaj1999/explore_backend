import { PACKAGE_DESTINATION_TYPES, PACKAGE_TYPES } from "common/constant.common";
import { Schema, Types, model } from "mongoose";

export interface IPackage {
  name: string;
  slug: string;
  title: string;
  cover: string;
  image: string;
  type: PACKAGE_TYPES; // GROUP | SINGLE | COUPLE
  destinationType: PACKAGE_DESTINATION_TYPES;
  placeId: Types.ObjectId; //if type domestic
  placeName: string; //if type domestic
  countryId: Types.ObjectId;
  countryName: string;
  tagline: string;
  description: string;
  day: number;
  night: number;
  includes: { title: string; image: string }[];
  inclusion: string[];
  exclusion: string[];
  iteneries: { day: number; title: string; description: string }[];
  price: number;
  isTopTrending: boolean;
  activities: { image: string; title: string; description: string }[];
  metaTitle: string;
  metaDescription: string;
  seoOverView: string;
}

//todo review
const packageSchema = new Schema<IPackage>(
  {
    name: String,
    slug: String,
    title: String,
    cover: String,
    image: String,
    type: String,
    destinationType: String, //international or domestic
    placeId: Types.ObjectId,
    placeName: String,
    countryId: Types.ObjectId,
    countryName: String,
    tagline: String,
    description: String,
    day: Number,
    night: Number,
    includes: [
      //Cab Transfer, Hotel Stay, Meals, Sight Seeing
      {
        title: String,
        image: String,
      },
    ],
    inclusion: [String],
    exclusion: [String],
    iteneries: [
      {
        day: Number,
        title: String,
        description: String,
      },
    ],
    price: Number,
    isTopTrending: { type: Boolean, default: false }, // For listing in top trending packages section (below).
    activities: [
      {
        image: String,
        title: String,
        description: String,
      },
    ],
    metaTitle: String,
    metaDescription: String,
    seoOverView: String,
  },
  {
    timestamps: true,
  },
);

export const Package = model<IPackage>("packages", packageSchema);
