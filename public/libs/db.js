"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB() {
    const DB_URI = `${process.env.DB_URI}`;
    mongoose_1.default
        .connect(DB_URI)
        .then(() => {
        console.log("Connected to MongoDB");
    })
        .catch((err) => {
        (0, logger_1.default)(`${err}`);
    });
}
exports.default = connectDB;
