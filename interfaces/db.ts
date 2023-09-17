import { Document } from "mongoose";

export interface IUser extends Document {
  username: String;
  password: String;
  email: String;
  reset_code: ICode;
  verifie_code: Number;
  verified: Boolean;
  verified_at: Date;
  start_sending_verify_email: Date;
  created_at: Date;
}
export interface ICode extends Document {
  code: Number;
  logged_times: Number;
  daily_mails: Number;
  next_send_time: Date;
  expire_at: Date;
}

export interface IEvent extends Document {
  title: String;
  date: Date;
  userId: String;
}
export interface ISession extends Document {
  version: String;
  expires_at: Date;
  userId: String;
  valid: Boolean;
}
