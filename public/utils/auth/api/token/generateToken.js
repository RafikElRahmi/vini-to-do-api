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
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const session_1 = require("../session/session");
function generateAccessToken(userId) {
    const expiresIn = 300;
    const secretKey = `${process.env.SECRET_KEY}`;
    const token = jsonwebtoken_1.default.sign({ userId }, secretKey, {
        expiresIn: expiresIn,
    });
    const expires = new Date(Date.now() + expiresIn * 1000);
    return { token, expires };
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(userId, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const expiresIn = 3600 * 24 * 7;
        const expires = new Date(Date.now() + expiresIn * 1000);
        const version = (0, uuid_1.v4)();
        const sessionPayload = { version, expires_at: expires, userId };
        const session = sessionId || (yield (0, session_1.createSession)(sessionPayload));
        const secretKey = `${process.env.SECRET_KEY_REFRESH}`;
        const token = jsonwebtoken_1.default.sign({ userId, version, sessionId: session }, secretKey, {
            expiresIn: expiresIn,
        });
        if (sessionId) {
            yield (0, session_1.updateSession)(session, version, expires);
        }
        return { token, expires };
    });
}
exports.generateRefreshToken = generateRefreshToken;
