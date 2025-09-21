const { listModels, deleteModel } = require("../services/modelRegistryService");

// GET /diagnose/models
exports.getModels = (req, res) => {
  const models = listModels();
  res.json({ models });
};

// DELETE /diagnose/models/:name
exports.removeModel = (req, res) => {
  const { name } = req.params;
  deleteModel(name);
  res.json({ message: `Modell ${name} gelöscht` });
};
