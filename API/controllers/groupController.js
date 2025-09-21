const Group = require("../models/Group");

exports.getGroups = async (req, res) => {
  const groups = await Group.find({ userId: req.user.id }).populate(
    "wishlistIds",
  );
  res.json(groups);
};

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  const group = new Group({ userId: req.user.id, name, wishlistIds: [] });
  await group.save();
  res.status(201).json(group);
};

exports.addListToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { wishlistId } = req.body;
  const group = await Group.findOne({ _id: groupId, userId: req.user.id });
  if (!group) return res.status(404).json({ error: "Gruppe nicht gefunden" });
  if (!group.wishlistIds.includes(wishlistId)) {
    group.wishlistIds.push(wishlistId);
    await group.save();
  }
  res.json(group);
};

exports.removeListFromGroup = async (req, res) => {
  const { groupId, wishlistId } = req.params;
  const group = await Group.findOne({ _id: groupId, userId: req.user.id });
  if (!group) return res.status(404).json({ error: "Gruppe nicht gefunden" });
  group.wishlistIds = group.wishlistIds.filter(
    (id) => id.toString() !== wishlistId,
  );
  await group.save();
  res.json(group);
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  await Group.deleteOne({ _id: groupId, userId: req.user.id });
  res.json({ message: "Gruppe gelöscht" });
};
