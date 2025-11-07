# SF-1 � Scraper-Matrix (Stand: 2025-11-01)

## 1. Parser im Repo
| Seedbank / Quelle | Parser-Datei                                        | Test vorhanden | Zuletzt gepr�ft | Bemerkung         |
|-------------------|------------------------------------------------------|----------------|-----------------|-------------------|
| (Generic List)    | apps/price-service/src/parsers/list.ts               | nein           |                 | Listenseiten      |
| Zamnesia          | apps/price-service/src/parsers/zamnesia.ts           | nein           |                 | Shop �Zamnesia�   |

## 2. Geplante Parser
| Seedbank / Quelle | Geplanter Dateiname                                  | Priorit�t | Bemerkung           |
|-------------------|------------------------------------------------------|-----------|----------------------|
| Royal Queen Seeds | apps/price-service/src/parsers/royalqueenseeds.ts    | hoch      | viele Sorten         |
| Seed City         | apps/price-service/src/parsers/seedcity.ts           | mittel    | gutes Preis-Spektrum |
| Dutch Passion     | apps/price-service/src/parsers/dutchpassion.ts       | mittel    | Klassiker            |

## 3. Tests (sollen angelegt werden)
- `apps/price-service/tests/list.spec.ts`
- `apps/price-service/tests/zamnesia.spec.ts`

## 4. K8s-Scraper-Runtime
Diese Manifeste geh�ren zur Ausf�hrung der Scraper im Cluster und m�ssen mitgef�hrt werden:
- `k8s/scraper/configmap.yaml`
- `k8s/scraper/cronjob-watchdog.yaml`
- `k8s/scraper/deployment-worker.yaml`
- `k8s/scraper/hpa.yaml`
- `k8s/scraper/service-metrics.yaml`
- `k8s/scraper/service-monitor.yaml`
- `k8s/scraper/networkpolicy.yaml`
- `k8s/scraper/pdb.yaml`
- `k8s/scraper/reliability.ym` *(pr�fen, Schreibfehler?)*

## 5. N�chste Aktion
- Tests f�r `list.ts` und `zamnesia.ts` schreiben.
- Tabelle regelm��ig aktualisieren, wenn neue Parser entstehen.
# Scraper Guide

## Prinzipien
- robots.txt respektieren (Minimalâ€‘Check enthalten). Keine Captchaâ€‘Umgehung.
- Niedrige Requestâ€‘Rate, kurze Pausen zwischen Seiten (sleep 1â€“2 s+).
- Selektoren versionieren. Bei 0 Treffern Alarm im Log.

## Neues Adapterâ€‘Modul anlegen
1) Datei unter `src/adapters/<partner>.ts` erstellen.
2) `seedbank`, `startUrl`, `run(page)` implementieren.
3) In `index.ts` in `pickAdapter` & `targetToOrigin` registrieren.
4) K8s CronJob YAML kopieren, TARGET anpassen.

## Normalisierung
- `NormalizedPrice`: name, seedbank, price(EUR), currency.
- Gruppierung pro Strain â†’ `currentPrices[]` fÃ¼r DBâ€‘Upsert.

## Persistenz
- Upsert setzt `currentPrices` und `lastUpdated` auf `now`.
- Optionaler Verlauf: zusÃ¤tzlich `priceHistory` im Backend pflegen.

## Fehlerbehandlung
- Sammlung in `errors[]`, Ausgabe im Log.
- Bei HTTP 403/429 Job abbremsen (Schedule/Delay erhÃ¶hen) und Adapter prÃ¼fen.
# SF‑1 Scraper‑Reliability


Ziel: Ausfallsichere, idempotente Scrapes mit Backoff‑Retry, Deduplikation, Locking, Dead‑Letter, Metriken und Self‑Heal.


Komponenten
- Mongo Job‑Queue (`scraper.jobs`) mit Zuständen: queued, running, done, failed, dead.
- Uniqueness‑Key: `source + seedId + variant + day` zur Deduplikation.
- Exponentielles Retry mit Jitter, Max‑Attempts = 5.
- Lease‑Lock per `leaseUntil` + Heartbeat. Orphan‑Requeue nach Timeout.
- Dead‑Letter nach Max‑Attempts.
- Metriken über Prometheus (/metrics): job_counts, durations, failures, retries.
- Health‑Endpoint: `/health/scraper` mit Detailstatus und jüngsten Fehlern.
- Watchdog‑CronJob: räumt hängen gebliebene Jobs auf.
- K8s: Deployment Worker, HPA, PDB, NetworkPolicy, ServiceMonitor.


Idempotenz
- Upsert ins Ziel (Preise) per eindeutiger Schlüssel (source, seedId, variant, date).
- Job‑Uniq‑Index verhindert Doppelanlage.


Sicherheit
- Keine Secrets im Code. DB‑Creds via vorhandenen Sealed Secrets.
# Runbook: Scraper‑Reliability


Checks
- `GET /health/scraper` liefert Zustände und letzte Dead‑Jobs.
- Prometheus: `sf1_scraper_jobs{state="failed"}` beobachten.
- Watchdog Cron läuft alle 5 Minuten.


Störungen
- Hohe Fail‑Rate: Parser prüfen, Zeitouts erhöhen, Backoff anpassen.
- Dead‑Queue > 0: Ursachenanalyse je Quelle, ggf. Blocken der Quelle.


Wiederherstellung
- Self‑Heal Job starten (siehe Script) oder Cron abwarten.
