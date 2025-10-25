import { PLACE_TYPES } from "common/constant.common";
import { Schema, Types, model } from "mongoose";

/* 
  Place
*/

export interface IPlace {
  name: string;
  dropdownTitle: string;
  cover: string;
  startingPackagePrice: string;
  image: string;
  slug: string;
  type: PLACE_TYPES;
  // countryId: Types.ObjectId; // if the type of place is Domestice then countryId and countryName is required
  // countryName: string;
  tagline: string;
  about: string;
  aboutTitle: string;
  aboutImage: String;
  destinations: Types.ObjectId[];
  isTopDestination: boolean;
  isTopDestinationOrder: number;
  mustFollows: string[];
  avoidThings: string[];
  showInMenu: boolean;
  title: string; //for meta data
  description: string; //for meta data
  // thingsTodoDescription: string;
  thingsTodoArr: { title: string; image: string; description: string }[];
}

const placeSchema = new Schema<IPlace>(
  {
    name: String,
    dropdownTitle: String,
    startingPackagePrice: String,
    cover: String,
    image: String,
    slug: String,
    type: String,
    // countryId: Types.ObjectId, // if the type of place is Domestice then countryId and countryName is required
    // countryName: String,
    tagline: String,
    about: String,
    aboutTitle: String,
    aboutImage: String,
    isTopDestination: { type: Boolean, default: false },
    isTopDestinationOrder: Number,
    showInMenu: { type: Boolean, default: false },
    mustFollows: [String],
    avoidThings: [String],
    title: String,
    description: String,
    // thingsTodoDescription: String,
    thingsTodoArr: [{ title: String, image: String, description: String }],
  },
  { timestamps: true },
);

export const Place = model<IPlace>("places", placeSchema);
