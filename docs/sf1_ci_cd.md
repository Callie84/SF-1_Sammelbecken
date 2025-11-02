# SF-1 — CI / CD & Deploy-Pipeline (Stand: 2025-11-01)

## 1. Repository
- GitHub: https://github.com/Callie84/SF-1_Sammelbecken
- Typische Branches: `feat/vite`, `main`

## 2. Pflicht-Checks
- **Smoke/smoke** MUSS laufen.
- Lint/Tests für Parser empfohlen: `npx vitest run` im Ordner `apps/price-service/`.

## 3. Empfohlene Build-/Deploy-Reihenfolge
1. **price-service** bauen/testen  
   - Pfad: `apps/price-service/`
   - Grund: Scraper liefern Daten für Frontend/Backend
2. **backend** bauen  
   - Pfad: `apps/backend/`
3. **frontend** bauen  
   - Pfad: `apps/frontend/`
4. **k8s apply**  
   - Pfad: `k8s/`
   - Reihenfolge siehe `docs/sf1_k8s_deploy.md`

## 4. CI-Schritte (GitHub Actions, sinngemäß)
- checkout
- setup node 20
- install deps (ggf. via `docs/deps_automation.md`)
- run tests (vitest, lint)
- docker build + push
- kubectl apply -f k8s/

## 5. Secrets / Konfiguration
- Registry- und Kubeconfig-Daten NICHT im Repo.
- Bereitstellung über CI-Secret.
- Siehe auch: `docs/sf1_security_secrets_template.md`

## 6. Nächste Aktion
- Workflow-Datei in `.github/workflows/` prüfen/ergänzen
- Smoke-Test-Script in `scripts/` ablegen
