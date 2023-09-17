"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
//home route
router.route("/").get((req, res) => {
    res.send("Hello from routes!");
});
//error logger route
router.post("/log", (req, res) => {
    const { trace } = req.body;
    (0, logger_1.default)(trace);
    res.sendStatus(200);
});
exports.default = router;
