import { ISession } from "@interfaces/db";
import { Schema, model, models } from "mongoose";

const SessionSchema = new Schema<ISession>({
  expires_at: { type: Date, required: true },
  version: { type: String, required: true },
  userId: { type: String, required: true },
  valid: { type: Boolean, required: true ,default : true},
});
const Session = models.Session || model<ISession>("Session", SessionSchema);
export default Session;
