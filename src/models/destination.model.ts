import { DESTINATION_TYPES } from "common/constant.common";
import { Schema, Types, model } from "mongoose";

export interface IDestination {
  name: string;
  slug: string;
  description: string;
  cover: string;
  placeId: Types.ObjectId; //country or place
  placeName: string;
  type: DESTINATION_TYPES;
  metaData: {
    title: string;
    description: string;
  };
}

const destinationSchema = new Schema<IDestination>(
  {
    name: String,
    slug: String,
    description: String,
    cover: String,
    placeId: Types.ObjectId,
    placeName: String,
    type: String,
    metaData: {
      title: String,
      description: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Destination = model<IDestination>("destinations", destinationSchema);
