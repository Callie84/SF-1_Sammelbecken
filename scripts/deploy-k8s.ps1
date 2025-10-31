param(
    [string] = "default"
)

kubectl apply -f k8s/secrets.yaml --namespace 
kubectl apply -f k8s/price-service.yaml --namespace 
kubectl apply -f k8s/backend.yaml --namespace 
kubectl apply -f k8s/ingress-caddy.yaml --namespace 
