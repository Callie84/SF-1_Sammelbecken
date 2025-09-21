const Channel = require("../models/Channel");
const Message = require("../models/Message");

// Channels
exports.listChannels = async (req, res) => {
  const channels = await Channel.find();
  res.json(channels);
};

exports.createChannel = async (req, res) => {
  const { name, description } = req.body;
  const channel = new Channel({ name, description, createdBy: req.user.id });
  await channel.save();
  res.status(201).json(channel);
};

// Messages
exports.postMessage = async (req, res) => {
  const { channelId, content } = req.body;
  const message = new Message({ channelId, userId: req.user.id, content });
  await message.save();
  res.status(201).json(message);
};

exports.getMessages = async (req, res) => {
  const { channelId } = req.params;
  const messages = await Message.find({ channelId }).sort({ timestamp: 1 });
  res.json(messages);
};
