"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDailyExpires = exports.dailyLogged = exports.dailyMails = exports.isCodeExpired = exports.isExpired = void 0;
function isExpired(expirationDate = new Date("2023-08-18T14:21:22.021Z")) {
    const newDate = new Date(Date.now() + 5 * 60 * 1000);
    const currentDate = new Date();
    const expiration = new Date(expirationDate);
    const next_send = expiration < currentDate;
    if (expiration > newDate) {
        return { new_next_send_time: expiration, next_send };
    }
    else {
        return { new_next_send_time: newDate, next_send };
    }
}
exports.isExpired = isExpired;
function isCodeExpired(expirationDate = new Date("2023-08-18T14:21:22.021Z")) {
    const currentDate = new Date();
    const expiration = new Date(expirationDate);
    return expiration < currentDate;
}
exports.isCodeExpired = isCodeExpired;
function dailyMails(daily) {
    if (daily <= 0) {
        return { daily: 0, dailyValid: false };
    }
    return { daily, dailyValid: true };
}
exports.dailyMails = dailyMails;
function dailyLogged(daily = 0) {
    daily += 1;
    if (daily > 3) {
        return { daily, dailyValid: false };
    }
    return { daily, dailyValid: true };
}
exports.dailyLogged = dailyLogged;
function setDailyExpires(expirationDate = new Date("2023-08-18T14:21:22.021Z")) {
    const newDate = new Date(Date.now() + 60 * 60 * 1000);
    if (expirationDate > newDate) {
        return { next_send_time: expirationDate };
    }
    else {
        return { next_send_time: newDate };
    }
}
exports.setDailyExpires = setDailyExpires;
