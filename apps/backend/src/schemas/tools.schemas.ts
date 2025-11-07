import { z } from "zod";

export const powerCostSchema = z.object({
  watt: z.number().positive().max(10000),
  kwhPrice: z.number().positive().max(2),
  hoursVeg: z.number().int().nonnegative().max(24*120),
  hoursBloom: z.number().int().nonnegative().max(24*120),
  hoursPerDayVeg: z.number().int().min(1).max(24).default(18),
  hoursPerDayBloom: z.number().int().min(1).max(24).default(12)
});

export const ppfdSchema = z.object({
  ppfd: z.number().positive(), // ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµmol/mÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â²/s
  photoperiodHours: z.number().positive().max(24)
});

export const dliFromPPFDschema = ppfdSchema; // Alias

export const dliSchema = z.object({
  dli: z.number().positive(), // mol/mÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â²/day
  photoperiodHours: z.number().positive().max(24)
});