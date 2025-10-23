# Programm: PowerShell
# Zweck: Aktualisierte Alertmanager-Config anwenden und Rollout abwarten
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$k8s  = Join-Path $repo 'k8s/monitoring'

$cfg = Join-Path $k8s '50-alertmanager-config.yaml'
if(-not (Test-Path $cfg)) { throw "Datei fehlt: $cfg" }

kubectl apply -f $cfg | Out-Host
kubectl -n monitoring rollout restart deploy/alertmanager | Out-Null
kubectl -n monitoring rollout status deploy/alertmanager --timeout=180s | Out-Null
Write-Host "[SF-1] Alertmanager Config aktiv. UI: https://alertmanager.seedfinderpro.de"