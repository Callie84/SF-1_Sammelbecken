const Seedbank = require("../models/Seedbank");

exports.listSeedbanks = async (req, res) => {
  const banks = await Seedbank.find().sort({ name: 1 });
  res.json(banks);
};
