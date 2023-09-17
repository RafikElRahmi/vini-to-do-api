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
exports.reminder = void 0;
const event_1 = __importDefault(require("../../models/event"));
const user_1 = __importDefault(require("../../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const reminder = () => {
    const interval = 60 * 1000;
    reminderSender();
    setInterval(reminderSender, interval);
};
exports.reminder = reminder;
const getMunite = (time) => {
    const modifiedTime = new Date(time);
    modifiedTime.setSeconds(0, 0);
    return modifiedTime.getTime();
};
const reminderSender = () => __awaiter(void 0, void 0, void 0, function* () {
    const current = new Date();
    const events = yield event_1.default.find();
    for (let event of events) {
        const beforeHour = getMunite(new Date(event.date)) - 60 * 60 * 1000;
        if (beforeHour === getMunite(current)) {
            console.log('its worked');
            yield sendReminder(event.title, event.userId);
        }
    }
});
const sendReminder = (title, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ _id: userId });
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
        },
    });
    const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: user.email,
        subject: "TO-DO Reminder",
        text: `this message is task reminder`,
        html: `<p>Dear ${user.username}, <br/> You have a task that start in 1 hour <br/> <strong>${title}</strong></p>`,
    };
    try {
        yield transporter.sendMail(mailOptions);
        const error = "";
        return error;
    }
    catch (error) {
        return error;
    }
});
