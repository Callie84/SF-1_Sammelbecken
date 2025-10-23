# Programm: PowerShell
# Zweck: Receiver-Secret und Templates entfernen, alten devnull-Stand wiederherstellen (optional)
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$k8s  = Join-Path $repo 'k8s/monitoring'

$delete = @(
  '55-alertmanager-config-secret.yaml',
  '56-alertmanager-templates.yaml',
  '34-prometheus-rules-watchdog.yaml'
)
foreach($f in $delete){ $p = Join-Path $k8s $f; if(Test-Path $p){ kubectl delete -f $p --ignore-not-found } }

kubectl -n monitoring rollout restart deploy/alertmanager | Out-Null
kubectl -n monitoring rollout restart deploy/prometheus  | Out-Null

Write-Host "[SF-1] Receiver entfernt."