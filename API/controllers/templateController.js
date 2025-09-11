const { listRoomTemplates, getRoomTemplate } = require('../services/templateService');

// GET /planner/templates
exports.listTemplates = (req, res) => {
  res.json(listRoomTemplates());
};

// GET /planner/templates/:id
exports.getTemplate = (req, res) => {
  const tpl = getRoomTemplate(req.params.id);
  if (!tpl) return res.status(404).json({ error: 'Template nicht gefunden' });
  res.json(tpl);
};