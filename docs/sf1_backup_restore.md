# SF-1 — Backup & Restore (Stand: 2025-11-01)

## 1. Ziel
SF-1 soll täglich Mongo + k8s-Status + wichtige Projektdateien sichern und mindestens 1× pro Monat einen Restore-Test fahren.

## 2. Relevante k8s-Manifeste
Quelle: `k8s/backup/`
- 00-namespace.yaml
- 01-backup-pvc.yaml
- 10-secret-s3.yaml
- 11-secret-mongo.yaml
- 12-secret-rsync.yaml
- 20-mongodump-cronjob.yaml
- 30-kubedump-cronjob.yaml
- 41-rsync-cronjob.yaml

Quelle: `k8s/restore-drill/`
- cronjob.yml  ? führt Restore-Probe aus

## 3. Gesicherte Ressourcen
- **MongoDB** aus `k8s/mongo.yaml`
- **Kubernetes-Ressourcen** (Cluster-Dump) über `30-kubedump-cronjob.yaml`
- **Dateien/Volumes** per rsync über `41-rsync-cronjob.yaml`
- **Ablage**: S3-Target aus `10-secret-s3.yaml`

## 4. Secrets
- Zugangsdaten werden NICHT ins Repo geschrieben.
- Werden über `k8s/backup/10-secret-s3.yaml`, `11-secret-mongo.yaml`, `12-secret-rsync.yaml` eingespielt.
- Siehe auch `docs/sf1_security_secrets_template.md`.

## 5. Restore-Ablauf (manuell)
1. Namespace `backup` sicherstellen (00-namespace.yaml)
2. S3-/Mongo-Secrets anwenden
3. Cronjob aus `k8s/restore-drill/cronjob.yml` anstoßen
4. Backend/Price-Service prüfen
5. Ergebnis in `docs/sf1_uebergabe.md` dokumentieren

## 6. Nächste Aktion
- Monatlichen Restore-Test einplanen
- S3-Zugang 1×/Quartal prüfen
