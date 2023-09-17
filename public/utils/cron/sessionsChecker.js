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
exports.sessionsChecker = void 0;
const session_1 = __importDefault(require("../../models/session"));
function sessionsChecker() {
    const interval = 5 * 60 * 1000;
    setInterval(checkSessions, interval);
}
exports.sessionsChecker = sessionsChecker;
const checkSessions = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date().getTime();
    const sessions = yield session_1.default.find();
    for (let session of sessions) {
        const sessionExpires = new Date(session.expires_at).getTime();
        if (now > sessionExpires) {
            session.valid = false;
            yield session.save();
        }
    }
});
