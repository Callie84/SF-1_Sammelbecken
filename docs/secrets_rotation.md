# Secrets-Rotation für SF-1

Ziel: Regelmäßige, nachvollziehbare Rotation aller sensitiven Schlüssel ohne Downtime. Sealed Secrets bleiben Standard.

## Geltungsbereich (Inventar)
| Schlüssel | Zweck | Ort in K8s | Rotationsintervall |
|---|---|---|---|
| MONGO_PASS | DB-User-Passwort | secret `mongo-auth` | 90 Tage |
| JWT_SECRET | Token-Signatur | secret `api-auth` | 90 Tage |
| COOKIE_SECRET | Session/CSRF | secret `api-auth` | 90 Tage |
| S3_ACCESS_KEY | Backup-Access | secret `backup-s3` | 180 Tage |
| S3_SECRET_KEY | Backup-Secret | secret `backup-s3` | 180 Tage |
| SMTP_PASS | Outbound-Mail | secret `smtp-auth` | 180 Tage |
| ALERT_SMTP_PASS | Alertmanager | secret `alertmanager-smtp` | 180 Tage |
| OAUTH_GITHUB_SECRET | Login OAuth | secret `oauth-github` | 180 Tage |
| SESSION_KEY | Server-Session | secret `api-auth` | 90 Tage |

## Grundsätze
- Kein Klartext im Repo. **Nur** versiegelte Manifeste (Sealed Secrets) committen.
- Rotation = **Erzeugen → Prüfen → Versiegeln → Deploy → Verifizieren**.
- Rollback: Vorherige SealedSecret-Manifeste behalten; Versionen in Git.

## Ablauf (Übersicht)
1. **Lokal generieren**: neue Werte mit `scripts/rotate_secrets.ps1` erzeugen (legt Dateien unter `k8s\secrets\pending\` ab).  
2. **Prüfen**: Längen/Alphabet/Entropie in der JSON und Fingerprints kontrollieren.  
3. **Versiegeln**: mit `kubeseal` aus Pending-YAML → `k8s\secrets\sealed\*.yaml`.  
4. **Review & Merge**: PR nur mit versiegelten Dateien.  
5. **Deploy**: `kubectl apply -f k8s/secrets/sealed/` (Dokumentation; nicht hier ausführen).  
6. **Verifizieren**: App-Health, Login, Backups, Alerts.  
7. **Bereinigen**: `k8s\secrets\pending\` lokal löschen.

## Tests nach Rotation (Checkliste)
- `/api/health` → 200 OK  
- Neue Logins (JWT/Session) funktionieren  
- Backups laufen (S3 Credentials ok)  
- Alertmanager sendet Testmail  
- MongoDB-Auth greift

## Risiken & Mitigation
- **Alte Pods mit alten Secrets** → Inkonsistenz.  
  *Mitigation*: nach Apply gezielt Rollout von Deployments/StatefulSets.
- **Plaintext-Leak im Repo**.  
  *Mitigation*: Pending-Verzeichnis im `.gitignore` (siehe unten), nur `sealed/` commiten.
- **Fehlender kubeseal-Key**.  
  *Mitigation*: Cluster-Backup der Sealed-Secrets-Keys vorhanden halten; ohne Key ist Entschlüsselung im Cluster unmöglich.

## .gitignore-Ergänzung (nur Beispiel, ins Repo aufnehmen)
