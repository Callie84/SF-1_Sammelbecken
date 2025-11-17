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