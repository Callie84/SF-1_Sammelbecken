const { getFilterOptions } = require('../services/optionsService');

exports.filterOptions = async (req, res) => {
  const options = await getFilterOptions();
  res.json(options);
};