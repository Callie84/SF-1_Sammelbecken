# Alertmanager Receiver (Eâ€‘Mail + Slack)

## Ziele
- Kritische Alerts â†’ Slack + Eâ€‘Mail
- Warnungen â†’ Eâ€‘Mail
- Watchdog feuert dauerhaft (Heartbeat) â†’ bestÃ¤tigt Pipeline

## EmpfÃ¤nger
- Slack: `#alerts` via Incoming Webhook
- Eâ€‘Mail: `ops@seedfinderpro.de`

## Sicherheit
- Komplette Alertmanagerâ€‘Konfiguration liegt als **Secret** (`alertmanager-config-secret`) vor, nicht als ConfigMap.
- SMTPâ€‘Passwort befindet sich nur im Secret.

Status: Fertig. Kein Rollout in diesem Schritt.
NÃ¤chste Aktion: SpÃ¤ter `scripts/alerting-receiver-deploy.ps1` ausfÃ¼hren.