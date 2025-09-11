const express = require('express');
const cors = require('cors');
const app = express();
const priceRoutes = require('./src/routes/price');

app.use(cors());
app.use(express.json());
app.use('/api/prices', priceRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('SF-1 API läuft auf Port', PORT));