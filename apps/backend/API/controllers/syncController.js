const FavoriteItem = require("../models/FavoriteItem");

// GET /favorites/sync?since=timestamp
exports.getSyncData = async (req, res) => {
  const since = req.query.since ? new Date(req.query.since) : new Date(0);
  const items = await FavoriteItem.find({
    userId: req.user.id,
    $or: [{ updatedAt: { $gte: since } }, { deletedAt: { $gte: since } }],
  }).lean();
  res.json({ serverTime: new Date(), items });
};

// POST /favorites/sync
// body: { changes: [{ strain, note, deleted, timestamp }] }
exports.postSyncData = async (req, res) => {
  const { changes } = req.body;
  const results = [];
  for (const change of changes) {
    const { strain, note, deleted, timestamp } = change;
    const ts = new Date(timestamp);
    let item = await FavoriteItem.findOne({ userId: req.user.id, strain });
    if (!item) {
      if (!deleted) {
        item = new FavoriteItem({
          userId: req.user.id,
          strain,
          note,
          updatedAt: ts,
          deletedAt: null,
        });
        await item.save();
      }
    } else {
      if (ts > item.updatedAt) {
        if (deleted) {
          item.deletedAt = ts;
        } else {
          item.note = note;
          item.deletedAt = null;
          item.updatedAt = ts;
        }
        await item.save();
      }
    }
    if (item) results.push(item);
  }
  res.json({ serverTime: new Date(), synced: results });
};
