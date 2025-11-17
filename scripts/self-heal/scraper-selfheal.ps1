# Apply: setzt K8s‑Manifeste; Verify: prüft Metriken; Self‑Heal: triggert Watchdog
param(
[ValidateSet('Apply','Verify','Self-Heal')][string]$Mode = 'Verify'
)


function Apply-Manifests {
kubectl apply -f k8s/scraper/configmap.yaml
kubectl apply -f k8s/scraper/service-metrics.yaml
kubectl apply -f k8s/scraper/deployment-worker.yaml
kubectl apply -f k8s/scraper/hpa.yaml
kubectl apply -f k8s/scraper/pdb.yaml
kubectl apply -f k8s/scraper/networkpolicy.yaml
kubectl apply -f k8s/scraper/cronjob-watchdog.yaml
}


function Verify-State {
kubectl get deploy sf1-scraper-worker -n default
kubectl get hpa sf1-scraper-worker -n default
kubectl get svc sf1-scraper-metrics -n default
}


function Invoke-SelfHeal {
kubectl create job --from=cronjob/sf1-scraper-watchdog watchdog-manual-$(Get-Date -Format 'yyyyMMddHHmmss') -n default
}


switch ($Mode) {
'Apply' { Apply-Manifests; break }
'Verify' { Verify-State; break }
'Self-Heal' { Invoke-SelfHeal; break }
}