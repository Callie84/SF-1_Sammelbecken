# SFâ€‘1 â€“ Variante C (Highâ€‘End)

## Ziel
HAâ€‘fÃ¤hige, skalierbare Infrastruktur ohne Kostendruck. 2Ã— Server, getrennte Rollen, Observabilityâ€‘Stack.

## Komponenten
- k3s HA, Longhorn/Ceph Storage, External LB
- DB: MongoDB Atlas M10 (Multiâ€‘AZ)
- CDN+WAF: Cloudflare Pro
- Observability: Prometheus, Loki, Grafana, Tempo
- Rollouts: Argo Rollouts (Blue/Green, Canary)

## Reihenfolge (DoD)
1) Zwei Nodes + Shared Storage. **DoD:** Pods crossâ€‘node verteilt.
2) Atlas Cluster + Peering. **DoD:** < 10 ms Latenz zur App.
3) CI/CD mit Progressive Delivery. **DoD:** Canary 10%â†’100%.
4) Full Observability + SLOs. **DoD:** 99.9% Monatsâ€‘SLO messbar.

## Risiken & Mitigation
- Kosten â†’ Budgets/Alerts.
- KomplexitÃ¤t â†’ IaC, Runbooks, GameDays.