# SF-1 � Backup & Restore (Stand: 2025-11-01)

## 1. Ziel
SF-1 soll t�glich Mongo + k8s-Status + wichtige Projektdateien sichern und mindestens 1� pro Monat einen Restore-Test fahren.

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
- cronjob.yml  ? f�hrt Restore-Probe aus

## 3. Gesicherte Ressourcen
- **MongoDB** aus `k8s/mongo.yaml`
- **Kubernetes-Ressourcen** (Cluster-Dump) �ber `30-kubedump-cronjob.yaml`
- **Dateien/Volumes** per rsync �ber `41-rsync-cronjob.yaml`
- **Ablage**: S3-Target aus `10-secret-s3.yaml`

## 4. Secrets
- Zugangsdaten werden NICHT ins Repo geschrieben.
- Werden �ber `k8s/backup/10-secret-s3.yaml`, `11-secret-mongo.yaml`, `12-secret-rsync.yaml` eingespielt.
- Siehe auch `docs/sf1_security_secrets_template.md`.

## 5. Restore-Ablauf (manuell)
1. Namespace `backup` sicherstellen (00-namespace.yaml)
2. S3-/Mongo-Secrets anwenden
3. Cronjob aus `k8s/restore-drill/cronjob.yml` ansto�en
4. Backend/Price-Service pr�fen
5. Ergebnis in `docs/sf1_uebergabe.md` dokumentieren

## 6. N�chste Aktion
- Monatlichen Restore-Test einplanen
- S3-Zugang 1�/Quartal pr�fen
# SF-1 Disaster Recovery Runbook

> **ACHTUNG – NICHT AUSFÜHREN IM ALLTAG**
> Die folgenden Befehle sind ausschließlich für echte Recovery-Fälle gedacht.
> Sie gehören auf den Linux-Server (Bash), **nicht** in Windows PowerShell.


## 1 Ziel
Sicherstellung, dass SF-1 (SeedFinder PRO) nach totalem oder teilweisem Ausfall vollständig reproduzierbar wiederhergestellt werden kann.

---

## 2 Auslöser
- Hardware- oder Cloud-Ausfall  
- Datenverlust (S3, MongoDB, Volumes)  
- Kompromittierung (Security Incident)  
- Fehlgeschlagenes Deployment  
- Korrupte Container-Images / Registry-Probleme

---

## 3 Rollen & Zuständigkeiten
| Rolle | Aufgabe |
|-------|----------|
| Projektleiter | Recovery starten, Freigaben erteilen |
| DevOps Engineer | Backups einspielen, Cluster restoren |
| Security Officer | Ursache analysieren, Credentials rotieren |
| QA Engineer | Integritätsprüfung, Smoke Tests |

---

## 4 Wiederherstellungs-Prioritäten
1. DNS & Ingress → seedfinderpro.de erreichbar  
2. MongoDB → Datenbank mit GridFS / User Daten  
3. Backend API → Express / Node Container  
4. Frontend → React / NGINX Pod  
5. Monitoring → Prometheus + Grafana  
6. Alerting → Alertmanager + E-Mail/Slack  
7. Backup-System → Verifikation + Retention

---

## 5 Recovery-Checkliste

### 5.1 Cluster-Rebuild
```bash
# Server neu provisionieren
sudo apt update && sudo apt install -y kubeadm kubectl docker.io
# Join-Token vom Backup verwenden
kubeadm join <MASTER_IP> --token <token> --discovery-token-ca-cert-hash <hash>
# SF-1 Restore-Drill: Files / Volumes

## Ziel
Regelmäßige Überprüfung, ob Dateibackups aus S3 (sf1-backups) korrekt synchronisierbar und vollständig sind.

---

## Ablaufübersicht
1. Test-Verzeichnis erstellen (lokal oder auf Staging-Server).  
2. 10 Beispieldateien aus S3 abrufen (`--dryrun`).  
3. Integrität und Struktur prüfen.  
4. Ergebnis dokumentieren.

---

## Durchführung (Windows-PowerShell)

```powershell
cd "C:\Users\kling\Desktop\SF-1_Sammelbecken\scripts"
.\restore_drill_files.ps1 -Bucket "sf1-backups" -TestDir "C:\SF1_restore_test"
# SF-1 Recovery Post-Mortem

## Datum
YYYY-MM-DD

## Ereignis
(Beschreibung des Ausfalls oder Tests)

## Ursache
(Kurze Zusammenfassung der Fehlerquelle)

## Auswirkungen
(Welche Systeme oder Nutzer waren betroffen)

## Maßnahmen
(Welche Schritte wurden durchgeführt)

## Dauer
(Startzeit → Endzeit)

## Lessons Learned
(Was wurde verbessert oder angepasst)

---

**Bearbeitet von:** Projektleitung SF-1
# Runbooks (Betrieb)

## Deploy Rollback (API)
1) `kubectl -n sf1 rollout history deploy/sf1-backend`
2) `kubectl -n sf1 rollout undo deploy/sf1-backend --to-revision=N`
3) Smokeâ€‘Test `/health`

## DB Restore
