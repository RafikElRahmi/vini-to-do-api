"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.resendEmail = exports.verifyUser = exports.refreshAuth = exports.getAuth = exports.verifyResetAccess = exports.setPassword = exports.resetPassword = exports.logout = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const hash_1 = __importDefault(require("../utils/auth/api/hash"));
const logger_1 = __importDefault(require("../utils/logger"));
const emailSender_1 = __importStar(require("../utils/auth/api/mail/emailSender"));
const check_1 = require("../utils/auth/api/mail/check");
const decodeToken_1 = require("../utils/auth/api/token/decodeToken");
const token_1 = require("../utils/auth/api/token/token");
const session_1 = __importDefault(require("../models/session"));
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).send("Invalid username or password");
            }
            const user = yield user_1.default.findOne({ username });
            if (!user) {
                return res.status(404).send("invalid user");
            }
            const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(403).send("Incorrect password");
            }
            yield (0, token_1.createLoginTokens)(res, user._id);
            return res.status(200).send({ isLogged: true, isVerified: user.verified });
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.login = login;
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password, email, } = req.body;
            if (!username || !password || !email) {
                return res.status(400).send("Invalid form data");
            }
            const user = yield user_1.default.findOne({
                $or: [{ username }, { email }],
            });
            if (user) {
                if (user.email === email) {
                    return res.status(409).send("email");
                }
                else {
                    return res.status(409).send("username");
                }
            }
            const passwordHash = yield (0, hash_1.default)(password);
            const { code, next_send } = yield (0, emailSender_1.sendVerificationCode)(email);
            if (!code || !next_send) {
                return res.status(500).send("error occured");
            }
            const newData = {
                username,
                email,
                password: passwordHash,
                verifie_code: code,
                start_sending_verify_email: next_send,
            };
            const newUser = yield user_1.default.create(newData);
            yield (0, token_1.createLoginTokens)(res, newUser._id);
            return res.status(201).send("created");
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.register = register;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refresh_token } = yield (0, token_1.getToken)(req);
            if (!refresh_token.length) {
                return res.status(307).send("no token");
            }
            const refresh = yield (0, decodeToken_1.decodeRefreshToken)(refresh_token);
            if (!refresh || (refresh === null || refresh === void 0 ? void 0 : refresh.expiredAt)) {
                return res.status(307).send("token expired");
            }
            const verified = yield (0, token_1.verifyVersions)(refresh);
            if (!verified) {
                return res.status(307).send("token expired");
            }
            yield session_1.default.findByIdAndUpdate(refresh.sessionId, { valid: false });
            return res.status(201).send("created");
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.logout = logout;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield user_1.default.findOne({ email });
            if (!user) {
                return res.status(404).send("user not found");
            }
            const { errorSending, nextMidnight, dailyValidation, sendingValidation, next_send_time, code, expire_at, daily_mails, } = yield (0, emailSender_1.default)(user);
            if (errorSending) {
                (0, logger_1.default)(`${errorSending}`);
                return res.status(503).send("error sending email");
            }
            if (!sendingValidation) {
                return res.status(429).send(user.reset_code.next_send_time);
            }
            if (!dailyValidation) {
                return res.status(429).send(nextMidnight);
            }
            yield user_1.default.updateOne({
                _id: user._id,
            }, {
                $set: {
                    "reset_code.code": code,
                    "reset_code.logged_times": 0,
                    "reset_code.expire_at": expire_at,
                    "reset_code.daily_mails": daily_mails,
                    "reset_code.next_send_time": next_send_time,
                },
            });
            return res.status(200).send("email sent");
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.resetPassword = resetPassword;
function setPassword(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { password, confpass } = req.body;
            const { userId } = req.params;
            const { code } = req.query;
            const user = yield user_1.default.findOne({ _id: userId });
            if (!user) {
                return res.status(404).send("user not found");
            }
            const { dailyValid } = (0, check_1.dailyLogged)(user.reset_code.logged_times - 1);
            if (!dailyValid) {
                return res.status(429).send("detected spam");
            }
            const codeinNumber = parseInt((code === null || code === void 0 ? void 0 : code.toString()) || "", 0);
            if (codeinNumber !== user.reset_code.code ||
                codeinNumber <= 10000000 ||
                codeinNumber > 100000000) {
                return res.status(403).send("wrong code");
            }
            const expiration = (0, check_1.isCodeExpired)((_a = user.reset_code) === null || _a === void 0 ? void 0 : _a.expire_at);
            if (expiration) {
                return res.status(403).send("code expired");
            }
            if (password !== confpass) {
                return res.status(400).send("password mismatch");
            }
            const passwordHash = yield (0, hash_1.default)(password);
            yield user_1.default.updateOne({
                _id: user._id,
            }, {
                $set: {
                    password: passwordHash,
                },
            });
            return res.status(204).send("password changed");
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.setPassword = setPassword;
function verifyResetAccess(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const user = yield user_1.default.findOne({ _id: userId });
            if (!user) {
                return res.status(404).send("user not found");
            }
            const { daily, dailyValid } = (0, check_1.dailyLogged)((_a = user.reset_code) === null || _a === void 0 ? void 0 : _a.logged_times);
            yield user_1.default.updateOne({
                _id: user._id,
            }, {
                $set: {
                    "reset_code.logged_times": daily,
                },
            });
            if (!dailyValid) {
                if (daily === 4) {
                    const { next_send_time } = (0, check_1.setDailyExpires)((_b = user.reset_code) === null || _b === void 0 ? void 0 : _b.next_send_time);
                    yield user_1.default.updateOne({
                        _id: user._id,
                    }, {
                        $set: {
                            "reset_code.next_send_time": next_send_time,
                        },
                    });
                    return res.status(429).send(next_send_time);
                }
                return res.status(429).send(user.reset_code.next_send_time);
            }
            return res.status(200).send({ daily, dailyValid });
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.verifyResetAccess = verifyResetAccess;
function getAuth(req, res) {
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
            const isVerified = user.verified;
            return res.status(200).send({ Logged: true, isVerified });
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.getAuth = getAuth;
function refreshAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refresh_token } = yield (0, token_1.getToken)(req);
            if (!refresh_token.length) {
                return res.status(307).send("no token");
            }
            const refresh = yield (0, decodeToken_1.decodeRefreshToken)(refresh_token);
            if (!refresh || (refresh === null || refresh === void 0 ? void 0 : refresh.expiredAt)) {
                return res.status(307).send("token expired");
            }
            const verified = yield (0, token_1.verifyVersions)(refresh);
            if (!verified) {
                return res.status(307).send("token expired");
            }
            yield (0, token_1.refreshTokens)(res, refresh);
            return res.status(200).send("request ok");
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.refreshAuth = refreshAuth;
function verifyUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { access_token } = yield (0, token_1.getToken)(req);
            if (!access_token) {
                return res.status(401).send("expired token");
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
            const { code } = req.body;
            const codeInt = parseInt(code);
            if (!codeInt || !(codeInt < 100000000 && codeInt >= 10000000)) {
                return res.status(400).send("bad request");
            }
            if (codeInt !== parseInt(user.verifie_code)) {
                return res.status(400).send("bad request");
            }
            user.verified = true;
            user.verified_at = new Date();
            yield user.save();
            return res.status(200).send("request ok");
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.verifyUser = verifyUser;
function resendEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { access_token } = yield (0, token_1.getToken)(req);
            if (!access_token) {
                return res.status(401).send("expired token");
            }
            const access = yield (0, decodeToken_1.decodeAccessToken)(access_token);
            const isExpiredToken = (0, token_1.verifyExpires)(access.exp);
            if (isExpiredToken) {
                return res.status(401).send("token expired");
            }
            const user = yield user_1.default.findById(access.userId);
            if (!user) {
                return res.status(404).send("user not found");
            }
            const { next_send } = (0, check_1.isExpired)(user.start_sending_verify_email);
            if (!next_send) {
                return res.status(429).send(user.start_sending_verify_email);
            }
            const { code, next_send: sendValidation } = yield (0, emailSender_1.sendVerificationCode)(user.email);
            if (!code || !sendValidation) {
                return res.status(500).send("error occured");
            }
            user.verifie_code = code;
            user.start_sending_verify_email = sendValidation;
            yield user.save();
            return res.status(200).send("request ok");
        }
        catch (error) {
            (0, logger_1.default)(`${error}`);
            return res.status(500).send("error occured");
        }
    });
}
exports.resendEmail = resendEmail;
