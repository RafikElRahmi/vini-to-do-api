"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dailySetter_1 = require("./dailySetter");
const reminder_1 = require("./reminder");
const sessionsChecker_1 = require("./sessionsChecker");
function cronProcesses() {
    (0, dailySetter_1.dailyMailsSetter)();
    (0, reminder_1.reminder)();
    (0, sessionsChecker_1.sessionsChecker)();
}
exports.default = cronProcesses;
