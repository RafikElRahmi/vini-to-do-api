"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    userId: { type: String, required: true },
});
const Event = mongoose_1.models.Event || (0, mongoose_1.model)("Event", EventSchema);
exports.default = Event;
