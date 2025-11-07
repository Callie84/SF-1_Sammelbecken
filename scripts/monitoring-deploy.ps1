# Programm: PowerShell
# Zweck: Monitoring-Stack deterministisch deployen
# Voraussetzungen: kubectl im PATH, Kubecontext gesetzt

$ErrorActionPreference = 'Stop'

Write-Host "[SF-1] Deploy Monitoring ..."

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$k8s  = Join-Path $repo 'k8s/monitoring'

$files = @(
  '00-namespace.yaml',
  '10-loki-configmap.yaml','11-loki-statefulset.yaml','12-loki-service.yaml',
  '20-promtail-configmap.yaml','21-promtail-daemonset.yaml',
  '30-prometheus-configmap.yaml','31-prometheus-deployment.yaml','32-prometheus-service.yaml',
  '40-grafana-datasources.yaml','41-grafana-dashboards.yaml','42-grafana-deployment.yaml','43-grafana-service.yaml','44-grafana-ingress.yaml'
) | ForEach-Object { Join-Path $k8s $_ }

foreach($f in $files){
  if(-not (Test-Path $f)){ throw "Datei fehlt: $f" }
}

# Apply in Reihenfolge
kubectl apply -f (Join-Path $k8s '00-namespace.yaml')

$rest = $files | Where-Object { -not $_.EndsWith('00-namespace.yaml') }
foreach($f in $rest){
  Write-Host "kubectl apply -f $f"; kubectl apply -f $f | Out-Host
}

Write-Host "[SF-1] Warten bis Pods laufen ..."
kubectl wait --for=condition=available --timeout=180s -n monitoring deployment/grafana || Write-Warning "Grafana noch nicht verfÃ¼gbar"
kubectl wait --for=condition=available --timeout=180s -n monitoring deployment/prometheus || Write-Warning "Prometheus noch nicht verfÃ¼gbar"

Write-Host "[SF-1] Fertig. Zugriff: https://grafana.seedfinderpro.de"