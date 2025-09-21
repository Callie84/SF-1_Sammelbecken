const Seedbank = require("../models/Seedbank");

// Alle Seedbanks anzeigen
exports.list = async (req, res) => {
  const banks = await Seedbank.find();
  res.json(banks);
};

// Seedbank erstellen
exports.create = async (req, res) => {
  try {
    const bank = new Seedbank(req.body);
    await bank.save();
    res.status(201).json(bank);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Seedbank aktualisieren
exports.update = async (req, res) => {
  try {
    const bank = await Seedbank.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bank)
      return res.status(404).json({ error: "Seedbank nicht gefunden" });
    res.json(bank);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Seedbank löschen
exports.remove = async (req, res) => {
  await Seedbank.findByIdAndDelete(req.params.id);
  res.json({ message: "Seedbank gelöscht" });
};
