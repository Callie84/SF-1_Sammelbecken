"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const scraper_1 = require("./routes/scraper");
const health_1 = require("./scraper/health");
const PORT = Number(process.env.PORT ?? 3000);
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB ?? "sf1";
async function main() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const mc = new mongodb_1.MongoClient(MONGO_URI);
    await mc.connect();
    const db = mc.db(DB_NAME);
    app.use((0, scraper_1.scraperRouter)(db));
    app.use((0, health_1.scraperHealthRouter)(db));
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.listen(PORT, () => {
        // ready
    });
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
