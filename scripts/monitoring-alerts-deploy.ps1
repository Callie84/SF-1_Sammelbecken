# Programm: PowerShell
# Zweck: Alerts + Alertmanager + Blackbox deterministisch deployen
$ErrorActionPreference = 'Stop'

Write-Host "[SF-1] Deploy Monitoring Alerts ..."
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$k8s  = Join-Path $repo 'k8s/monitoring'

$files = @(
  '30-prometheus-configmap.yaml',
  '33-prometheus-rules-configmap.yaml',
  '60-blackbox-exporter-deployment.yaml','61-blackbox-exporter-service.yaml',
  '50-alertmanager-config.yaml','51-alertmanager-deployment.yaml','52-alertmanager-service.yaml','53-alertmanager-ingress.yaml'
) | ForEach-Object { Join-Path $k8s $_ }

foreach($f in $files){ if(-not (Test-Path $f)){ throw "Datei fehlt: $f" } }

foreach($f in $files){ Write-Host "kubectl apply -f $f"; kubectl apply -f $f | Out-Host }

Write-Host "[SF-1] Prometheus neu laden ..."
kubectl -n monitoring rollout restart deploy/prometheus | Out-Null
kubectl -n monitoring rollout status deploy/prometheus --timeout=180s | Out-Null

Write-Host "[SF-1] Fertig. Alertmanager UI: https://alertmanager.seedfinderpro.de"