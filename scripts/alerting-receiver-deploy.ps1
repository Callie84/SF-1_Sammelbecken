# Programm: PowerShell
# Zweck: Receiver-Config + Templates + Watchdog deployen und Prometheus/Alertmanager neu starten
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$k8s  = Join-Path $repo 'k8s/monitoring'

$files = @(
  '55-alertmanager-config-secret.yaml',
  '56-alertmanager-templates.yaml',
  '34-prometheus-rules-watchdog.yaml',
  '51-alertmanager-deployment.yaml'
) | ForEach-Object { Join-Path $k8s $_ }

foreach($f in $files){ if(-not (Test-Path $f)){ throw "Datei fehlt: $f" } }

foreach($f in $files){ Write-Host "kubectl apply -f $f"; kubectl apply -f $f | Out-Host }

Write-Host "[SF-1] Rollout Alertmanager ..."
kubectl -n monitoring rollout restart deploy/alertmanager | Out-Null
kubectl -n monitoring rollout status deploy/alertmanager --timeout=180s | Out-Null

Write-Host "[SF-1] Rollout Prometheus ..."
kubectl -n monitoring rollout restart deploy/prometheus | Out-Null
kubectl -n monitoring rollout status deploy/prometheus --timeout=180s | Out-Null

Write-Host "[SF-1] Fertig. Watchdog sollte in Alertmanager sichtbar sein."