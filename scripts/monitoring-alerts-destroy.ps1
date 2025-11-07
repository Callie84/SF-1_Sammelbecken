# Programm: PowerShell
# Zweck: Entfernt Alertmanager, Blackbox, Regeln (Prometheus Config bleibt, falls gewÃ¼nscht ersetzen)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$k8s  = Join-Path $repo 'k8s/monitoring'

$delete = @(
  '53-alertmanager-ingress.yaml','52-alertmanager-service.yaml','51-alertmanager-deployment.yaml','50-alertmanager-config.yaml',
  '61-blackbox-exporter-service.yaml','60-blackbox-exporter-deployment.yaml',
  '33-prometheus-rules-configmap.yaml'
)
foreach($f in $delete){ $p = Join-Path $k8s $f; if(Test-Path $p){ kubectl delete -f $p --ignore-not-found } }
Write-Host "[SF-1] Alerts entfernt"