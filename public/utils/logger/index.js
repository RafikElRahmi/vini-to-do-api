"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const logError = (trace) => {
    try {
        if (trace) {
            const traceString = `${trace}\n ...................................................................................... \n`;
            promises_1.default.appendFile("./logs/errors.log", traceString);
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = logError;
