"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SessionSchema = new mongoose_1.Schema({
    expires_at: { type: Date, required: true },
    version: { type: String, required: true },
    userId: { type: String, required: true },
    valid: { type: Boolean, required: true, default: true },
});
const Session = mongoose_1.models.Session || (0, mongoose_1.model)("Session", SessionSchema);
exports.default = Session;
