# Restoreâ€‘Drill (S3)

## Zweck
Backups sind nur dann wertvoll, wenn die **Wiederherstellung** nachweislich funktioniert. Dieser Drill lÃ¤dt das **neueste Mongoâ€‘Dumpâ€‘Archiv** aus S3, stellt es **in eine separate Restoreâ€‘Datenbank** wieder her und fÃ¼hrt **Validierungschecks** aus. Ergebnis wird protokolliert.

## Architektur
- **Quelle:** S3â€‘Bucket `sf1-backups`, Prefix `mongo/` (gzipâ€‘Archive via `mongodump --archive --gzip`).
- **Ziel:** Getrennte Datenbank (z.â€¯B. `sf1_restore`) per `MONGODB_URI` (nicht Produktion).
- **Ablauf:**
  1. Initâ€‘Container (AWS CLI) findet und lÃ¤dt **jÃ¼ngstes** Dumpâ€‘Archiv in `emptyDir`.
  2. Hauptâ€‘Container (Mongoâ€‘Tools) fÃ¼hrt `mongorestore` gegen `MONGODB_URI` aus (`--drop`).
  3. Validierung via `mongosh --eval` (z.â€¯B. Collections zÃ¤hlen, Beispieldokumente prÃ¼fen).
- **Zeitplan:** WÃ¶chentlich sonntags 04:00 (CronJob). Adâ€‘hocâ€‘Job manuell auslÃ¶sbar.

## Sicherheitsregeln
- **Nie** auf Produktionsâ€‘URI zeigen. Eigenes Restoreâ€‘Ziel (z.â€¯B. stagingâ€‘Cluster oder isolierte Instanz).
- Secrets via K8sâ€‘Secret `sf1-restore-drill`. Keine Klartextâ€‘Creds im Repo.
- Logs enthalten **keine** sensiblen Inhalte.

## Erforderliche K8sâ€‘Ressourcen
- Secret: `sf1-restore-drill` mit `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `S3_BUCKET`, `S3_PREFIX`, `MONGODB_URI`.
- CronJob: `sf1-restore-drill` im Namespace `testing`.

## Validierung (Standard)
- ZÃ¤hle Collections.
- PrÃ¼fe, ob Kernâ€‘Collections existieren (z.â€¯B. `users`, `seeds`, `prices`, `logs`).
- Stichprobe: `db.seeds.findOne()` darf kein `null` sein.
- Ergebnisâ€‘Marker: `RESTORE_OK` oder `RESTORE_FAIL` im Log.

## Monitoringâ€‘Anbindung
- Optional: Promtail sammelt Podâ€‘Logs (`testing` Namespace). Alert auf `RESTORE_FAIL` in Kombination mit Cronâ€‘Zeitfenster.

## Betrieb
- WÃ¶chentlich automatisch. ZusÃ¤tzlich bei Releaseâ€‘Cut oder Backupâ€‘Ã„nderungen **manuell** auslÃ¶sen.
- Aufbewahrung: Nur Logs. Die wiederhergestellte DB kann nach Drill wieder **geleert** werden (nicht Teil dieses Jobs).

## Risiken & Mitigation
- **Falsche Zielâ€‘URI:** strikte Trennung, Secretâ€‘Review. Drill nur im `testing` Namespace.
- **Fehlende AWSâ€‘Rechte:** Minimalâ€‘Policy `s3:ListBucket` und `s3:GetObject` auf `sf1-backups/mongo/*`.
- **Dump inkompatibel:** Mongoâ€‘Version prÃ¼fen. Tools-Version an Produktionsdump anpassen.
- **Kosten/Latenz:** Downloads auÃŸerhalb Peakâ€‘Zeiten; wÃ¶chentliche Frequenz ausreichend.

## Manuelle Checks (falls nÃ¶tig)
- GrÃ¶ÃŸe und Datum des Archivs im Log verifizieren.
- Validierungszahlen gegen Erwartung grob plausibilisieren.

## Status & NÃ¤chste Aktion
**Status:** Dokumentation bereit.  
**NÃ¤chste Aktion:** Secret anlegen, CronJob anwenden, einmaligen Testlauf manuell triggern (siehe PowerShellâ€‘Skript).