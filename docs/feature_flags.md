# Feature-Flags für SF-1

## Ziel
Selektives Aktivieren/Deaktivieren von Funktionen ohne neuen Deploy. Für A/B-Tests, Canary-Releases und Premium-Features.

## Architektur
- **Backend-Layer:** zentrale Logik (`featureFlags.ts`)
- **Frontend-Layer:** UI-Steuerung (z. B. Beta-Badge)
- **ConfigMap:** Quelle der Wahrheitswerte (K8s)
- Flags werden bei Start geladen und gecached.

## Beispiel-Flags
| Flag | Beschreibung | Default |
|------|---------------|----------|
| `enablePriceAlerts` | Aktiviert Preis-Alarm-Funktion | false |
| `enableAffiliateAds` | Werbung und Affiliate-Module | true |
| `enableUGG1Integration` | Schaltet Grow-Guide-Integration frei | true |
| `enableAnalyticsBeta` | Neues Analytics-Dashboard | false |
| `enableUserJournal` | Tagebuch-Modul für Premium-User | true |

## Nutzung im Code
```ts
import { isFeatureEnabled } from "./featureFlags";
if (isFeatureEnabled("enableAnalyticsBeta")) {
  // Beta-Dashboard aktiv
}
