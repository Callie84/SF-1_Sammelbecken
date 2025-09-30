const Channel = require("../models/Channel");
const Message = require("../models/Message");
const GroupEvent = require("../models/GroupEvent");

// Statistiken: Anzahl Kanäle, Nachrichten, Events
async function getChannelStats() {
  const total = await Channel.countDocuments();
  return { totalChannels: total };
}

async function getMessageStats() {
  const total = await Message.countDocuments();
  const perChannel = await Message.aggregate([
    { $group: { _id: "$channelId", count: { $sum: 1 } } },
  ]);
  return { totalMessages: total, messagesPerChannel: perChannel };
}

async function getEventStats() {
  const totalGE = await GroupEvent.countDocuments();
  const upcoming = await GroupEvent.countDocuments({
    type: "event",
    eventDate: { $gte: new Date() },
  });
  return { totalGroupsEvents: totalGE, upcomingEvents: upcoming };
}

module.exports = { getChannelStats, getMessageStats, getEventStats };
