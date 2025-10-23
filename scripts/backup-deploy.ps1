# Programm: PowerShell
# Zweck: Backupâ€‘Stack deterministisch deployen
$ErrorActionPreference = 'Stop'

Write-Host "[SF-1] Deploy Backup ..."
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$k8s  = Join-Path $repo 'k8s/backup'

$files = @(
  '00-namespace.yaml','01-backup-pvc.yaml','10-secret-s3.yaml','11-secret-mongo.yaml','12-secret-rsync.yaml',
  '20-mongodump-cronjob.yaml','30-kubedump-cronjob.yaml','41-rsync-cronjob.yaml'
) | ForEach-Object { Join-Path $k8s $_ }

foreach($f in $files){ if(-not (Test-Path $f)){ throw "Datei fehlt: $f" } }

kubectl apply -f (Join-Path $k8s '00-namespace.yaml')
$rest = $files | Where-Object { -not $_.EndsWith('00-namespace.yaml') }
foreach($f in $rest){ Write-Host "kubectl apply -f $f"; kubectl apply -f $f | Out-Host }

Write-Host "[SF-1] CronJobs registriert. Manuell testen mit scripts/backup-manual-run.ps1"