const express = require('express');
const router = express.Router();

const prices = [
  { strain: "Banana", seedbank: "Zamnesia", price: 29.95 },
  { strain: "Jell-O-Nate", seedbank: "Royal Queen Seeds", price: 34.9 }
];

router.get('/', (req, res) => {
  res.json(prices);
});

module.exports = router;
