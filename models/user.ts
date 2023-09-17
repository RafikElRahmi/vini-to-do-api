import { ICode, IUser } from "@interfaces/db";
import { Schema, model, models } from "mongoose";

const reset_password = new Schema<ICode>({
  code: {
    type: Number,
    default: null,
  },
  logged_times: {
    type: Number,
    required: true,
    default: 0,
  },
  daily_mails: {
    type: Number,
    required: true,
    default: 5,
  },
  next_send_time: {
    type: Date,
    required: true,
    default: new Date(),
  },
  expire_at: {
    type: Date,
    default: null,
  },
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  reset_code: reset_password,
  verifie_code: {
    type: Number,
    default: null,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verified_at: {
    type: Date,
    default: null,
  },
  start_sending_verify_email: {
    type: Date,
    required: true,
    default: new Date(),
  },
  created_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
});
const User = models.User || model<IUser>("User", UserSchema);
export default User;
