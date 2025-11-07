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
