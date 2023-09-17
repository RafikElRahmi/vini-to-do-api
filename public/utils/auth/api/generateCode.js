"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateCode() {
    const code = Math.floor(Math.random() * (9 * Math.pow(10, 7) - 1)) + Math.pow(10, 7);
    return code.toString();
}
exports.default = generateCode;
