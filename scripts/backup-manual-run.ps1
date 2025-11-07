# Programm: PowerShell
# Zweck: CronJobs sofort auslÃ¶sen und Logs prÃ¼fen
$ErrorActionPreference = 'Stop'

kubectl create job --from=cronjob/mongodump-daily -n backup mongodump-manual-$(Get-Date -Format 'yyyyMMddHHmmss') | Out-Null
kubectl create job --from=cronjob/kubedump-daily -n backup kubedump-manual-$(Get-Date -Format 'yyyyMMddHHmmss') | Out-Null

Write-Host "[SF-1] Warten auf Abschluss ..."
kubectl wait --for=condition=complete job -n backup -l job-name in (mongodump-manual,kubedump-manual) --timeout=300s 2>$null | Out-Null

Write-Host "[SF-1] Letzte Logs (mongodump):"
kubectl logs -n backup job/$(kubectl get jobs -n backup -o name | Select-String mongodump-manual | Select-Object -Last 1)
Write-Host "[SF-1] Letzte Logs (kubedump):"
kubectl logs -n backup job/$(kubectl get jobs -n backup -o name | Select-String kubedump-manual | Select-Object -Last 1)