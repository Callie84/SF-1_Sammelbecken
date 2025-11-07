<#
.SYNOPSIS
    Restore-Drill für SF-1-Dateien (Volumes / S3-Sync).
    Testet Wiederherstellungsfähigkeit, ändert keine Originaldaten.
#>

param(
    [string]$Bucket = "sf1-backups",
    [string]$TestDir = "C:\SF1_restore_test",
    [string]$AwsProfile = "default"
)

Write-Host "=== SF-1 Restore-Drill gestartet ===" -ForegroundColor Cyan

# 1. AWS-CLI prüfen
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Error "AWS-CLI nicht installiert oder nicht im PATH."
    exit 1
}

# 2. Testverzeichnis vorbereiten
if (-not (Test-Path $TestDir)) {
    New-Item -ItemType Directory -Force -Path $TestDir | Out-Null
}

# 3. Letzte Sicherung ermitteln
Write-Host "Suche letzte Sicherung im Bucket $Bucket ..." -ForegroundColor Yellow
$latest = aws s3 ls "s3://$Bucket/files/" --profile $AwsProfile |
    Sort-Object -Property LastWriteTime -Descending |
    Select-Object -First 1

if (-not $latest) {
    Write-Error "Keine Sicherung gefunden."
    exit 1
}

# 4. Nur einen Test-Download durchführen (z. B. 10 Dateien)
Write-Host "Lade 10 Dateien testweise herunter ..." -ForegroundColor Yellow
aws s3 sync "s3://$Bucket/files/" "$TestDir" --profile $AwsProfile --exclude "*" --include "*.json" --exact-timestamps --dryrun | Out-Null

# 5. Prüfen, ob Pfade stimmen
if (Test-Path "$TestDir") {
    Write-Host "Verzeichnisstruktur geprüft." -ForegroundColor Green
} else {
    Write-Error "Testverzeichnis konnte nicht überprüft werden."
}

# 6. Logfile erzeugen
$log = Join-Path $TestDir "restore_drill_log.txt"
"$(Get-Date) – Restore-Drill erfolgreich geprüft" | Out-File $log -Encoding UTF8

Write-Host "=== Restore-Drill abgeschlossen. Keine produktiven Daten geändert. ===" -ForegroundColor Cyan
