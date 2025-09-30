const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✓ MongoDB verbunden"))
  .catch(err => console.warn("⚠ MongoDB nicht erreichbar"));

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.send('SF-1 Backend läuft');
});

const priceRoutes = require("./API/src/routes/price");
const seedRoutes = require("./API/src/routes/seeds");
app.use("/api/prices", priceRoutes);
app.use("/api/seeds", seedRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ SF-1 API: http://localhost:${PORT}`);
});
