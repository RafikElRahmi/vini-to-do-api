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
exports.verifyExpires = exports.verifyVersions = exports.refreshTokens = exports.createLoginTokens = exports.getToken = exports.setToken = void 0;
const generateToken_1 = require("./generateToken");
const session_1 = __importDefault(require("../../../../models/session"));
const setToken = (res, access, refresh) => {
    //@ts-ignore
    res.setHeader("Authorization", `Bearer ${access.token}`);
    res.setHeader("Expiration", `${access.expires}`);
    if (refresh) {
        res.setHeader("authentication", `Bearer ${refresh.token}`);
        res.setHeader("Refresh-Expiration", `${refresh.expires}`);
    }
};
exports.setToken = setToken;
function getToken(req) {
    var _a, _b;
    const access_token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "";
    const refresh_token = ((_b = req.headers.authentication) === null || _b === void 0 ? void 0 : _b.split(" ")[1]) || "";
    return { access_token, refresh_token };
}
exports.getToken = getToken;
function createLoginTokens(res, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const access = (0, generateToken_1.generateAccessToken)(userId);
        const refresh = yield (0, generateToken_1.generateRefreshToken)(userId);
        (0, exports.setToken)(res, access, refresh);
    });
}
exports.createLoginTokens = createLoginTokens;
function refreshTokens(res, refresh) {
    return __awaiter(this, void 0, void 0, function* () {
        const access = (0, generateToken_1.generateAccessToken)(refresh.userId);
        const refreshIfLessThan = new Date(Date.now() + 4 * 24 * 3600 * 1000);
        const expires = new Date(refresh.exp * 1000);
        if (refreshIfLessThan > expires) {
            const refreshData = yield (0, generateToken_1.generateRefreshToken)(refresh.userId, refresh.sessionId);
            (0, exports.setToken)(res, access, refreshData);
        }
        else {
            (0, exports.setToken)(res, access);
        }
    });
}
exports.refreshTokens = refreshTokens;
function verifyVersions(refresh) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionVersion = yield session_1.default.findById(refresh.sessionId);
        return sessionVersion.version === refresh.version && sessionVersion.valid;
    });
}
exports.verifyVersions = verifyVersions;
function verifyExpires(expiresTime) {
    const expires = new Date(expiresTime * 1000).getTime();
    const now = new Date().getTime();
    return now > expires;
}
exports.verifyExpires = verifyExpires;
