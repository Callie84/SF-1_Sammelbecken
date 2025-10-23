# Plausible Betrieb

## Erstkonfiguration
1) `kubectl apply -f k8s/analytics/*.yaml` in Reihenfolge: namespace â†’ postgres â†’ clickhouse â†’ plausible â†’ ingress
2) Ã–ffne https://analytics.seedfinderpro.de und lege die Site `seedfinderpro.de` an.
3) PrÃ¼fe, dass `/js/script.js` unter https://seedfinderpro.de/js/script.js geladen wird.

## Backups
- Postgres: Standardâ€‘PVC â†’ CronJob fÃ¼r `pg_dump` optional ergÃ¤nzen
- ClickHouse: Volume Snapshot; optional S3â€‘Backup per clickhouseâ€‘backup Tool

## Monitoring
- Health: `GET /` der plausibleâ€‘Service (HTTP 200)
- Logs: `kubectl logs deploy/plausible -n analytics`

## Sicherheit
- Adminâ€‘Registrierung per `DISABLE_REGISTRATION=true` blockiert
- Zugriff auf UI ggf. mit BasicAuthâ€‘Middleware schÃ¼tzen (Traefik)