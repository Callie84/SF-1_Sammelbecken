# SF-1 — Kubernetes Deploy (Stand: 2025-11-01)

## 1. Basis-Reihenfolge
1. k8s/secrets.yaml
2. k8s/mongo.yaml
3. k8s/backend.yaml
4. k8s/price-service.yaml
5. k8s/frontend.yaml
6. k8s/ingress-caddy.yaml

## 2. Erweiterungen (direkt im Root von k8s\)
- k8s/autoscaling.yaml
- k8s/cdn.yaml
- k8s/cert-issuer.yaml
- k8s/gateway.yaml
- k8s/search.yaml
- k8s/redis.yaml
- k8s/mongo-backup.yaml
- k8s/scraper-rqs.yaml
- k8s/scraper-zamnesia.yaml

## 3. Ordner-Struktur (Themen-Namespaces)
- k8s/analytics/* (namespace.yaml, plausible.yaml, clickhouse.yaml, ingress.yaml …)
- k8s/backup/* (00-namespace.yaml, 01-backup-pvc.yaml, CronJobs für mongodump/kubedump/rsync)
- k8s/monitoring/* (Prometheus, Loki, Grafana, Alertmanager, SLO-Rules)
- k8s/testing/* (00-namespace.yaml, smoke-CronJob)
- k8s/security/* (NetworkPolicies, Header, Labels)
- k8s/scraper/* (Config, Deployment-Worker, HPA, Service-Monitor)
- k8s/policies/* (supply-chain.yaml)
- k8s/restore-drill/* (cronjob.yml)

## 4. Vorgaben
- ingressClassName: caddy
- domain: seedfinderpro.de
- namespaces: default, monitoring, backup, testing
- Secrets nicht im Klartext committen ? k8s/secrets/*.yaml oder sealedsecret-*.yml

## 5. Apply-Hinweis
- Erst Root-Basis (Punkt 1)
- Dann thematische Ordner (analytics, monitoring, backup, security)
- Zuletzt ingress
