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
exports.dailyMailsSetter = void 0;
const user_1 = __importDefault(require("../../models/user"));
function dailyMailsSetter() {
    const now = new Date().getTime();
    let nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = nextMidnight.getTime() - now;
    const interval = 24 * 60 * 60 * 1000;
    setTimeout(() => {
        setDailyMails();
        setInterval(setDailyMails, interval);
    }, timeUntilMidnight);
}
exports.dailyMailsSetter = dailyMailsSetter;
const setDailyMails = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find();
    for (let user of users) {
        user.reset_code.daily_mails = 5;
        yield user.save();
    }
});
