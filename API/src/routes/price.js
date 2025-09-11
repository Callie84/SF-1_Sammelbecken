const express = require('express');
const router = express.Router();
const prices = require('../data/prices.json');

// GET /api/prices
router.get('/', (req, res) => {
  res.json(prices);
});

module.exports = router;