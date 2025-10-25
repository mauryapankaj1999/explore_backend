import { Schema, model } from "mongoose";

export interface IPartners {
  logo: string;
  order: number;
}

const partnersSchema = new Schema<IPartners>(
  {
    logo: String,
    order: Number,
  },
  {
    timestamps: true,
  },
);

export const Partners = model<IPartners>("partners", partnersSchema);
