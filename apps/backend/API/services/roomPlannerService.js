const RoomLayout = require("../models/RoomLayout");
const SetupItem = require("../models/SetupItem");

// Erstellt oder aktualisiert Layout
async function upsertLayout(userId, data) {
  const { id, name, width, length, placements } = data;
  let layout;
  if (id) {
    layout = await RoomLayout.findOneAndUpdate(
      { _id: id, userId },
      { name, width, length, placements },
      { new: true },
    );
  } else {
    layout = new RoomLayout({ userId, name, width, length, placements });
    await layout.save();
  }
  return layout;
}

// Liste aller Layouts
async function listLayouts(userId) {
  return RoomLayout.find({ userId });
}

// Stubs for Partner-API: Preise abrufen
async function fetchPartnerPrices(itemIds) {
  // Hier API-Aufruf zu Partnern (z.B. Amazon, GrowShop), simuliert mit Default-Preisen
  return itemIds.map((id) => ({
    itemId: id,
    price: (Math.random() * 50 + 10).toFixed(2),
  }));
}

module.exports = { upsertLayout, listLayouts, fetchPartnerPrices };
