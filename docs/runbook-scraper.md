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