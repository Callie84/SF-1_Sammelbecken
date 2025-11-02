# SF-1 — Scraper-Matrix (Stand: 2025-11-01)

## 1. Parser im Repo
| Seedbank / Quelle | Parser-Datei                                        | Test vorhanden | Zuletzt geprüft | Bemerkung         |
|-------------------|------------------------------------------------------|----------------|-----------------|-------------------|
| (Generic List)    | apps/price-service/src/parsers/list.ts               | nein           |                 | Listenseiten      |
| Zamnesia          | apps/price-service/src/parsers/zamnesia.ts           | nein           |                 | Shop „Zamnesia“   |

## 2. Geplante Parser
| Seedbank / Quelle | Geplanter Dateiname                                  | Priorität | Bemerkung           |
|-------------------|------------------------------------------------------|-----------|----------------------|
| Royal Queen Seeds | apps/price-service/src/parsers/royalqueenseeds.ts    | hoch      | viele Sorten         |
| Seed City         | apps/price-service/src/parsers/seedcity.ts           | mittel    | gutes Preis-Spektrum |
| Dutch Passion     | apps/price-service/src/parsers/dutchpassion.ts       | mittel    | Klassiker            |

## 3. Tests (sollen angelegt werden)
- `apps/price-service/tests/list.spec.ts`
- `apps/price-service/tests/zamnesia.spec.ts`

## 4. K8s-Scraper-Runtime
Diese Manifeste gehören zur Ausführung der Scraper im Cluster und müssen mitgeführt werden:
- `k8s/scraper/configmap.yaml`
- `k8s/scraper/cronjob-watchdog.yaml`
- `k8s/scraper/deployment-worker.yaml`
- `k8s/scraper/hpa.yaml`
- `k8s/scraper/service-metrics.yaml`
- `k8s/scraper/service-monitor.yaml`
- `k8s/scraper/networkpolicy.yaml`
- `k8s/scraper/pdb.yaml`
- `k8s/scraper/reliability.ym` *(prüfen, Schreibfehler?)*

## 5. Nächste Aktion
- Tests für `list.ts` und `zamnesia.ts` schreiben.
- Tabelle regelmäßig aktualisieren, wenn neue Parser entstehen.
