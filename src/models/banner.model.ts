import { BANNER_STATUS_TYPES } from "common/constant.common";
import { model } from "mongoose";
import { Schema } from "mongoose";

export interface IBanner {
  url: string;
  image: string;
  status: BANNER_STATUS_TYPES;
  title: string;
  largeTitle: string;
}

const bannerSchema = new Schema<IBanner>(
  {
    url: String,
    image: String,
    status: String,
    title: String,
    largeTitle: String,
  },
  {
    timestamps: true,
  },
);

export const Banner = model<IBanner>("banners", bannerSchema);
