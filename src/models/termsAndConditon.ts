import { model, Schema } from "mongoose";

export interface ITermsAndCondtion {
  termsAndCondition: string;
}

const termsAndConditionSchema = new Schema(
  {
    termsAndCondition: String,
  },
  {
    timestamps: true,
  },
);

export const TermsAndCondition = model<ITermsAndCondtion>("terms", termsAndConditionSchema);
