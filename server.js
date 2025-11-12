const express = require("express");
const cors = require("cors");
const app = express();
const priceRoutes = require("./API/src/routes/price");

app.use(cors());
app.use(express.json());
app.use("/api/prices", priceRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("SF-1 API läuft auf Port", PORT));

app.get("/api/ping", (req, res) =>
  res.status(200).json({ ok: true, time: new Date().toISOString() }),
);
app.get("/", (req, res) => res.status(200).send("SF-1 Backend läuft"));
app.get("/health", (req, res) =>
  res.status(200).json({ ok: true, uptime: process.uptime() }),
);

module.exports = app;
