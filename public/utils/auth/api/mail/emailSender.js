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
exports.sendVerificationCode = void 0;
const check_1 = require("./check");
const generateCode_1 = __importDefault(require("../generateCode"));
const createEmail_1 = __importDefault(require("./createEmail"));
const nodemailer_1 = __importDefault(require("nodemailer"));
function emailSender(user) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let code = "";
        let daily_mails = 0;
        let dailyValidation = false;
        let sendingValidation = true;
        let expire_at = "";
        let nextMidnight = "";
        let error = "";
        let next_send_time;
        try {
            const { next_send, new_next_send_time } = (0, check_1.isExpired)((_a = user.reset_code) === null || _a === void 0 ? void 0 : _a.next_send_time);
            if (next_send) {
                nextMidnight = new Date(new Date().setHours(24, 0, 0, 0));
                const actual_mail = ((_b = user.reset_code) === null || _b === void 0 ? void 0 : _b.daily_mails) === 0
                    ? 0
                    : ((_c = user.reset_code) === null || _c === void 0 ? void 0 : _c.daily_mails) || 5;
                const { daily, dailyValid } = (0, check_1.dailyMails)(actual_mail);
                dailyValidation = dailyValid;
                if (dailyValid) {
                    code = (0, generateCode_1.default)();
                    error = yield (0, createEmail_1.default)(user.email, user._id, code);
                    if (error === "") {
                        daily_mails = daily - 1;
                        next_send_time = new_next_send_time;
                        expire_at = `${new Date(Date.now() + 30 * 60 * 1000)}`;
                    }
                }
            }
            else {
                sendingValidation = false;
            }
        }
        catch (err) {
            error = err;
        }
        finally {
            return {
                code,
                errorSending: error,
                expire_at,
                daily_mails,
                next_send_time,
                dailyValidation,
                sendingValidation,
                nextMidnight,
            };
        }
    });
}
function sendVerificationCode(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = (0, generateCode_1.default)();
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                user: `${process.env.EMAIL}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            },
        });
        const mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: "verify code",
            text: `this message is very private`,
            html: `<p>Your activation code : <h2><strong>${code}</strong></h2></p>`,
        };
        try {
            yield transporter.sendMail(mailOptions);
            const next_send = new Date(Date.now() + 5 * 60 * 1000);
            return { code, next_send };
        }
        catch (error) {
            console.log(error);
            return { code: null, next_send: null };
        }
    });
}
exports.sendVerificationCode = sendVerificationCode;
exports.default = emailSender;
