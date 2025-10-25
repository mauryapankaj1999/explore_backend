import { model, Schema } from "mongoose";

export interface IAminities {
  title: string;
  image: string;
}

const aminitiesSchema = new Schema<IAminities>(
  {
    title: String,
    image: String,
  },
  {
    timestamps: true,
  },
);

export const Aminity = model<IAminities>("aminities", aminitiesSchema);
