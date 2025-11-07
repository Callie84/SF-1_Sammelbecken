# Alertmanager Receiver

## Routing
- `severity=critical` â†’ Eâ€‘Mail + Telegram
- `severity=warning`  â†’ Slack
- Default â†’ Eâ€‘Mail

## Annahmen
- SMTP: mailbox.org (Beispiel). Ersetze bei Bedarf Server/Absender.
- Telegram: Bot + Channel/Chat vorhanden.
- Slack: Incoming Webhook aktiv.

## Test
- `scripts/alerts-send-test.ps1 -Type critical`
- `scripts/alerts-send-test.ps1 -Type warning`

Status: Fertig. Keine AusfÃ¼hrung bis Goâ€‘Live.
NÃ¤chste Aktion: Falls abweichende Provider genutzt werden, Werte in YAML anpassen.