const {
  upsertLayout,
  listLayouts,
  fetchPartnerPrices,
} = require("../services/roomPlannerService");

// POST /planner/layout → Layout erstellen oder updaten
exports.saveLayout = async (req, res) => {
  const layout = await upsertLayout(req.user.id, {
    id: req.body.id,
    ...req.body,
  });
  res.json(layout);
};

// GET /planner/layouts → alle Layouts
exports.getLayouts = async (req, res) => {
  const layouts = await listLayouts(req.user.id);
  res.json(layouts);
};

// POST /planner/layout/:id/prices → Artikelpreise abrufen
exports.getPrices = async (req, res) => {
  const { placements } = await listLayouts(req.user.id).then((ls) =>
    ls.find((l) => l.id == req.params.id),
  );
  const itemIds = placements.map((p) => p.itemId);
  const prices = await fetchPartnerPrices(itemIds);
  res.json(prices);
};
