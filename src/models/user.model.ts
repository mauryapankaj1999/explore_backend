import { ROLES_TYPES } from "common/constant.common";
import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: ROLES_TYPES;
  refreshToken: string;
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    refreshToken: String,
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("users", userSchema);
