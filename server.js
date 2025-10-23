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
// Auth Routes
const authRoutes = require("./API/src/routes/auth");
app.use("/api/auth", authRoutes);

// Seed Routes
const seedRoutes = require("./API/src/routes/seed");
app.use("/api/seeds", seedRoutes);

// User Routes
const userRoutes = require("./API/src/routes/user");
app.use("/api/users", userRoutes);

// Admin Routes
const adminRoutes = require("./API/src/routes/admin");
app.use("/api/admin", adminRoutes);
app.use("/api/prices", priceRoutes);

// Health
app.get('/api/ping', (req,res) => res.json({ ok:true, time: new Date().toISOString() }));
app.get('/', (req,res) => res.send('SF-1 Backend lÃ¤uft'));
app.get('/health', (req,res) => res.json({ ok:true, uptime: process.uptime() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('SF-1 API lÃ¤uft auf Port', PORT));