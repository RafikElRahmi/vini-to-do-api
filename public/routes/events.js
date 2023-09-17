"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventController_1 = require("../controllers/eventController");
const express_1 = require("express");
const eventsRouter = (0, express_1.Router)();
eventsRouter.route("/events").get(eventController_1.getAllEvents).post(eventController_1.createEvent);
eventsRouter
    .route("/events/:eventId")
    .get(eventController_1.getOneEvent)
    .put(eventController_1.updateEvent)
    .delete(eventController_1.deleteEvent);
exports.default = eventsRouter;
