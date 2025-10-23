import { Router } from "express";
import { validate } from "../middleware/validate";
import { powerCostSchema, dliFromPPFDschema, dliSchema } from "../schemas/tools.schemas";

const router = Router();

// Stromkosten
router.post("/power-cost", validate(powerCostSchema), (req, res) => {
  const { watt, kwhPrice, hoursVeg, hoursBloom, hoursPerDayVeg, hoursPerDayBloom } = req.body;
  const kW = watt / 1000;
  const daysVeg = hoursVeg / hoursPerDayVeg;
  const daysBloom = hoursBloom / hoursPerDayBloom;
  const kWhVeg = kW * hoursVeg;
  const kWhBloom = kW * hoursBloom;
  const costVeg = kWhVeg * kwhPrice;
  const costBloom = kWhBloom * kwhPrice;
  const total = costVeg + costBloom;
  return res.json({ kWhVeg, kWhBloom, costVeg, costBloom, total, daysVeg, daysBloom });
});

// DLI aus PPFD
// DLI [mol/mÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â²/day] = PPFD [ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµmol/mÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â²/s] * photoperiod[h] * 3600 / 1e6
router.post("/dli-from-ppfd", validate(dliFromPPFDschema), (req, res) => {
  const { ppfd, photoperiodHours } = req.body;
  const dli = ppfd * photoperiodHours * 3600 / 1_000_000;
  return res.json({ dli });
});

// PPFD aus DLI
// PPFD [ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµmol/mÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â²/s] = DLI [mol/mÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â²/day] * 1e6 / (photoperiod[h] * 3600)
router.post("/ppfd-from-dli", validate(dliSchema), (req, res) => {
  const { dli, photoperiodHours } = req.body;
  const ppfd = dli * 1_000_000 / (photoperiodHours * 3600);
  return res.json({ ppfd });
});

export default router;