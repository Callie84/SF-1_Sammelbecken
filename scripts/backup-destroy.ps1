# Programm: PowerShell
# Zweck: Entfernen aller Backupâ€‘Ressourcen (PVC optional behalten)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$k8s  = Join-Path $repo 'k8s/backup'

$delete = @(
  '41-rsync-cronjob.yaml','30-kubedump-cronjob.yaml','20-mongodump-cronjob.yaml',
  '12-secret-rsync.yaml','11-secret-mongo.yaml','10-secret-s3.yaml','01-backup-pvc.yaml'
)
foreach($f in $delete){ $p = Join-Path $k8s $f; if(Test-Path $p){ kubectl delete -f $p --ignore-not-found } }
# Namespace optional
# kubectl delete -f (Join-Path $k8s '00-namespace.yaml') --ignore-not-found
Write-Host "[SF-1] Backup entfernt"