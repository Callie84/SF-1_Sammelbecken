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
