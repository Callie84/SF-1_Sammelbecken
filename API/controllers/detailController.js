const { getSeedDetail } = require("../services/detailService");

exports.detail = async (req, res) => {
  try {
    const { strain } = req.params;
    const data = await getSeedDetail(strain);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
