"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getOneEvent = exports.getAllEvents = void 0;
const event_1 = __importDefault(require("../models/event"));
const user_1 = __importDefault(require("../models/user"));
const decodeToken_1 = require("../utils/auth/api/token/decodeToken");
const token_1 = require("../utils/auth/api/token/token");
const logger_1 = __importDefault(require("../utils/logger"));
function getAllEvents(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { access_token } = yield (0, token_1.getToken)(req);
            if (!access_token) {
                return res.status(401).send("false");
            }
            const access = yield (0, decodeToken_1.decodeAccessToken)(access_token);
            const isExpired = (0, token_1.verifyExpires)(access.exp);
            if (isExpired) {
                return res.status(401).send("token expired");
            }
            const user = yield user_1.default.findById(access.userId);
            if (!user) {
                return res.status(404).send("user not found");
            }
            const events = yield event_1.default.find({ userId: user._id });
            const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return res.status(200).send(sortedEvents);
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.getAllEvents = getAllEvents;
function getOneEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { access_token } = yield (0, token_1.getToken)(req);
            if (!access_token) {
                return res.status(401).send("false");
            }
            const access = yield (0, decodeToken_1.decodeAccessToken)(access_token);
            const isExpired = (0, token_1.verifyExpires)(access.exp);
            if (isExpired) {
                return res.status(401).send("token expired");
            }
            const user = yield user_1.default.findById(access.userId);
            if (!user) {
                return res.status(404).send("user not found");
            }
            const { eventId } = req.params;
            const event = yield event_1.default.find({ _id: eventId });
            return res.status(200).send(event);
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.getOneEvent = getOneEvent;
function createEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { access_token } = yield (0, token_1.getToken)(req);
            if (!access_token) {
                return res.status(401).send("false");
            }
            const access = yield (0, decodeToken_1.decodeAccessToken)(access_token);
            const isExpired = (0, token_1.verifyExpires)(access.exp);
            if (isExpired) {
                return res.status(401).send("token expired");
            }
            const user = yield user_1.default.findById(access.userId);
            if (!user) {
                return res.status(404).send("user not found");
            }
            const { title, date } = req.body;
            if (!title || !date) {
                return res.status(400).send("Invalid form data");
            }
            const newEvent = {
                userId: user._id,
                date: new Date(date),
                title,
            };
            yield event_1.default.create(newEvent);
            const events = yield event_1.default.find({ userId: user._id });
            const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return res.status(200).send(sortedEvents);
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.createEvent = createEvent;
function updateEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { access_token } = yield (0, token_1.getToken)(req);
            if (!access_token) {
                return res.status(401).send("false");
            }
            const access = yield (0, decodeToken_1.decodeAccessToken)(access_token);
            const isExpired = (0, token_1.verifyExpires)(access.exp);
            if (isExpired) {
                return res.status(401).send("token expired");
            }
            const user = yield user_1.default.findById(access.userId);
            if (!user) {
                return res.status(404).send("user not found");
            }
            const { title, date } = req.body;
            const { eventId } = req.params;
            if (!title || !date || !eventId) {
                return res.status(400).send("Invalid form data");
            }
            const newData = {
                userId: user._id,
                date: new Date(date),
                title,
            };
            yield event_1.default.findByIdAndUpdate(eventId, newData);
            const events = yield event_1.default.find({ userId: user._id });
            const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return res.status(200).send(sortedEvents);
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.updateEvent = updateEvent;
function deleteEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { access_token } = yield (0, token_1.getToken)(req);
            if (!access_token) {
                return res.status(401).send("false");
            }
            const access = yield (0, decodeToken_1.decodeAccessToken)(access_token);
            const isExpired = (0, token_1.verifyExpires)(access.exp);
            if (isExpired) {
                return res.status(401).send("token expired");
            }
            const user = yield user_1.default.findById(access.userId);
            if (!user) {
                return res.status(404).send("user not found");
            }
            const { eventId } = req.params;
            if (!eventId) {
                return res.status(400).send("Invalid form data");
            }
            yield event_1.default.findByIdAndDelete(eventId);
            const events = yield event_1.default.find({ userId: user._id });
            const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return res.status(200).send(sortedEvents);
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.deleteEvent = deleteEvent;
