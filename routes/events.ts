import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getOneEvent,
  updateEvent,
} from "@controllers/eventController";
import { Router, Request, Response } from "express";
const eventsRouter = Router();

eventsRouter.route("/events").get(getAllEvents).post(createEvent);
eventsRouter
  .route("/events/:eventId")
  .get(getOneEvent)
  .put(updateEvent)
  .delete(deleteEvent);

export default eventsRouter;
