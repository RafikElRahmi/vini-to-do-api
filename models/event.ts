import { IEvent } from "@interfaces/db";
import { Schema, model, models } from "mongoose";

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  userId: { type: String, required: true },
});
const Event = models.Event || model<IEvent>("Event", EventSchema);
export default Event;
