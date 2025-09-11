const { getSuggestions } = require('../services/autocompleteService');

exports.autocomplete = async (req, res) => {
  const { q, limit } = req.query;
  const suggestions = await getSuggestions(q, limit);
  res.json(suggestions);
};