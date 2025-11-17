# Programm: PowerShell
# Zweck: Stack sauber entfernen (lassen Sie Ingress/Namespace stehen, wenn gewÃ¼nscht)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$k8s  = Join-Path $repo 'k8s/monitoring'

$applyOrder = @(
  '44-grafana-ingress.yaml','43-grafana-service.yaml','42-grafana-deployment.yaml','41-grafana-dashboards.yaml','40-grafana-datasources.yaml',
  '32-prometheus-service.yaml','31-prometheus-deployment.yaml','30-prometheus-configmap.yaml',
  '21-promtail-daemonset.yaml','20-promtail-configmap.yaml',
  '12-loki-service.yaml','11-loki-statefulset.yaml','10-loki-configmap.yaml'
)

foreach($f in $applyOrder){ $p = Join-Path $k8s $f; if(Test-Path $p){ kubectl delete -f $p --ignore-not-found } }
# Namespace optional lÃ¶schen
# kubectl delete -f (Join-Path $k8s '00-namespace.yaml') --ignore-not-found
Write-Host "[SF-1] Monitoring entfernt"