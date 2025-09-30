const {
  upsertTemplate,
  listTemplates,
  deleteTemplate,
} = require("../services/userTemplateService");

exports.saveTemplate = async (req, res) => {
  const tpl = await upsertTemplate(req.user.id, req.body);
  res.json(tpl);
};

exports.getTemplates = async (req, res) => {
  const tpls = await listTemplates(req.user.id);
  res.json(tpls);
};

exports.removeTemplate = async (req, res) => {
  await deleteTemplate(req.user.id, req.params.id);
  res.json({ message: "Template gelöscht" });
};
