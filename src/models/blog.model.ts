import { Schema, model } from "mongoose";

export interface IBlog {
  title: string;
  slug: string;
  cover: string;
  thumbnail: string;
  description: string;
  place: string;
  date: string;
  priority: number;
  metaTitle: string;
  metaDescription: string;
  createdAt?: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: String,
    slug: String,
    cover: String,
    thumbnail: String,
    description: String,
    place: String,
    date: String,
    priority: Number,
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
  },
);

export const Blog = model<IBlog>("blogs", blogSchema);
