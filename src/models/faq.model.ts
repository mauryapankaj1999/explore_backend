import { Schema, Types, model } from "mongoose";

export interface IFaq {
  // packageId: Types.ObjectId;
  placeId: Types.ObjectId;
  placeName: string;
  questions: { question: string; answer: string }[];
}

const faqSchema = new Schema<IFaq>(
  {
    // packageId: Types.ObjectId,
    placeId: Types.ObjectId,
    placeName: String,
    questions: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Faq = model<IFaq>("faqs", faqSchema);
