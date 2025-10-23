# Troubleshooting

| Problem | Ursache | LÃ¶sung |
|----------|----------|---------|
| Kein Zugriff aufÂ Grafana | Ingress oder DNS falsch | `kubectl describe ingress grafana -n monitoring` |
| Mongoâ€‘Fehler â€žECONNREFUSEDâ€œ | Service nicht gestartet | `kubectl get pods -n default`Â â†’Â Logs prÃ¼fen |
| Backup schlÃ¤gt fehl | S3Â Secret fehlt | `kubectl get secrets -n backup` prÃ¼fen |
| CIÂ â€žpermission deniedâ€œ | GHCRÂ Token unvollstÃ¤ndig | PATÂ mitÂ `write:packages` generieren |
| SmokeÂ CheckÂ fail | HealthÂ Endpoint falsch | `/api/health`Â implementieren |