require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");

const app = express();

// MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
const priceRoutes = require("./API/src/routes/price");
app.use("/api/prices", priceRoutes);

// Health
app.get('/api/ping', (req,res) => res.json({ ok:true, time: new Date().toISOString() }));
app.get('/', (req,res) => res.send('SF-1 Backend läuft'));
app.get('/health', (req,res) => res.json({ ok:true, uptime: process.uptime() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('SF-1 API läuft auf Port', PORT));