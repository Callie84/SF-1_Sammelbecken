const UserTemplate = require("../models/UserTemplate");

async function upsertTemplate(userId, data) {
  const { id, name, layoutData } = data;
  if (id) {
    return UserTemplate.findOneAndUpdate(
      { _id: id, userId },
      { name, layoutData },
      { new: true },
    );
  } else {
    const tpl = new UserTemplate({ userId, name, layoutData });
    await tpl.save();
    return tpl;
  }
}

async function listTemplates(userId) {
  return UserTemplate.find({ userId }).sort({ updatedAt: -1 });
}

async function deleteTemplate(userId, id) {
  return UserTemplate.deleteOne({ _id: id, userId });
}

module.exports = { upsertTemplate, listTemplates, deleteTemplate };
