const Channel = require("../models/Channel");
const Message = require("../models/Message");
const { logAction } = require("../services/adminLogService");

// Kanal löschen
exports.deleteChannel = async (req, res) => {
  await Channel.findByIdAndDelete(req.params.id);
  await Message.deleteMany({ channelId: req.params.id });
  await logAction(req.user.id, "DELETE_CHANNEL", { channelId: req.params.id });
  res.json({ message: "Channel gelöscht" });
};

// Nachricht löschen
exports.deleteMessage = async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  await logAction(req.user.id, "DELETE_MESSAGE", { messageId: req.params.id });
  res.json({ message: "Nachricht gelöscht" });
};
