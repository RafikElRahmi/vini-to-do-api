"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeRefreshToken = exports.decodeAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function decodeAccessToken(token) {
    let decodedToken;
    const secretKey = `${process.env.SECRET_KEY}`;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        console.log(error);
    }
    return decodedToken;
}
exports.decodeAccessToken = decodeAccessToken;
function decodeRefreshToken(token) {
    let decodedToken;
    const secretKey = `${process.env.SECRET_KEY_REFRESH}`;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        return decodedToken;
    }
    return decodedToken;
}
exports.decodeRefreshToken = decodeRefreshToken;
