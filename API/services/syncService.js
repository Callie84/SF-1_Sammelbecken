const FavoriteItem = require("../models/FavoriteItem");

// Konfliktauflösung: letzter `updatedAt` gewinnt
function resolveConflicts(local, server) {
  const merged = {};
  [...local, ...server].forEach((item) => {
    const key = item.strain;
    if (
      !merged[key] ||
      new Date(item.updatedAt) > new Date(merged[key].updatedAt)
    ) {
      merged[key] = item;
    }
  });
  return Object.values(merged);
}

async function backgroundSync(userId, localChanges) {
  // Hole Server-Daten seit lokalster Änderung
  const since = localChanges.reduce(
    (max, c) => (c.timestamp > max ? c.timestamp : max),
    new Date(0),
  );
  // Hole serverseitig Änderungen
  const serverItems = await FavoriteItem.find({
    userId,
    $or: [{ updatedAt: { $gte: since } }, { deletedAt: { $gte: since } }],
  }).lean();
  // Konfliktauflösung
  const resolved = resolveConflicts(localChanges, serverItems);
  // Speichere resolved auf Server
  for (const item of resolved) {
    await FavoriteItem.updateOne(
      { userId, strain: item.strain },
      { ...item },
      { upsert: true },
    );
  }
  return resolved;
}

module.exports = { resolveConflicts, backgroundSync };
