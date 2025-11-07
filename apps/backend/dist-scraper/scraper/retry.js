"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expBackoff = expBackoff;
function expBackoff(attempt, baseMs = 5000, maxMs = 300000) {
    const exp = Math.min(maxMs, baseMs * Math.pow(2, attempt));
    const jitter = Math.floor(Math.random() * baseMs);
    return Math.min(maxMs, exp + jitter);
}
