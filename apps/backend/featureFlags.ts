
---

## ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â© Datei 2 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â `C:\Users\kling\Desktop\SF-1_Sammelbecken\apps\backend\featureFlags.ts`

```typescript
/**
 * SF-1 Feature-Flag Manager
 * Quelle: /k8s/configmaps/feature-flags.yaml
 */

import fs from "fs";
import path from "path";

export type FeatureKey =
  | "enablePriceAlerts"
  | "enableAffiliateAds"
  | "enableUGG1Integration"
  | "enableAnalyticsBeta"
  | "enableUserJournal";

interface Flags {
  [key: string]: boolean;
}

let cache: Flags = {
  enablePriceAlerts: false,
  enableAffiliateAds: true,
  enableUGG1Integration: true,
  enableAnalyticsBeta: false,
  enableUserJournal: true,
};

const CONFIG_PATH = process.env.FEATURE_FLAGS_PATH || path.join(__dirname, "../../config/feature-flags.json");

/**
 * LÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¤dt Flags aus JSON-Datei (z. B. gemountete ConfigMap)
 */
export function loadFeatureFlags(): void {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
      cache = { ...cache, ...data };
      console.log("[SF-1] Feature-Flags geladen:", Object.keys(cache).length);
    } else {
      console.warn("[SF-1] Feature-Flags: Datei fehlt, Defaults aktiv.");
    }
  } catch (err) {
    console.error("[SF-1] Fehler beim Laden der Flags:", err);
  }
}

export function isFeatureEnabled(key: FeatureKey): boolean {
  return Boolean(cache[key]);
}

export function allFlags(): Flags {
  return { ...cache };
}

// Beim Start einmalig laden
loadFeatureFlags();
