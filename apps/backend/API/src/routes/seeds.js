const express = require('express');
const router = express.Router();
const Seed = require('../models/Seed');

router.get('/', async (req, res) => {
  try {
    const seeds = await Seed.find();
    res.json(seeds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const seed = new Seed(req.body);
    await seed.save();
    res.status(201).json(seed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
