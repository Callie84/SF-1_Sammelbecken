param(
    [string]$Namespace = "default"
)

kubectl apply -f k8s/secrets.yaml --namespace $Namespace
kubectl apply -f k8s/price-service.yaml --namespace $Namespace
kubectl apply -f k8s/backend.yaml --namespace $Namespace
kubectl apply -f k8s/ingress-caddy.yaml --namespace $Namespace
