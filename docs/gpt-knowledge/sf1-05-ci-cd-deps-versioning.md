# SF-1 � CI / CD & Deploy-Pipeline (Stand: 2025-11-01)

## 1. Repository
- GitHub: https://github.com/Callie84/SF-1_Sammelbecken
- Typische Branches: `feat/vite`, `main`

## 2. Pflicht-Checks
- **Smoke/smoke** MUSS laufen.
- Lint/Tests f�r Parser empfohlen: `npx vitest run` im Ordner `apps/price-service/`.

## 3. Empfohlene Build-/Deploy-Reihenfolge
1. **price-service** bauen/testen  
   - Pfad: `apps/price-service/`
   - Grund: Scraper liefern Daten f�r Frontend/Backend
2. **backend** bauen  
   - Pfad: `apps/backend/`
3. **frontend** bauen  
   - Pfad: `apps/frontend/`
4. **k8s apply**  
   - Pfad: `k8s/`
   - Reihenfolge siehe `docs/sf1_k8s_deploy.md`

## 4. CI-Schritte (GitHub Actions, sinngem��)
- checkout
- setup node 20
- install deps (ggf. via `docs/deps_automation.md`)
- run tests (vitest, lint)
- docker build + push
- kubectl apply -f k8s/

## 5. Secrets / Konfiguration
- Registry- und Kubeconfig-Daten NICHT im Repo.
- Bereitstellung �ber CI-Secret.
- Siehe auch: `docs/sf1_security_secrets_template.md`

## 6. N�chste Aktion
- Workflow-Datei in `.github/workflows/` pr�fen/erg�nzen
- Smoke-Test-Script in `scripts/` ablegen
# Abhängigkeits-Updates: Renovate & Dependabot

## Ziel
Automatisierte, kontrollierte Updates für npm, Docker und GitHub Actions. Kleine Updates gehen schnell durch, große Updates isoliert.

## Strategie
- **Dependabot**: Security-Alerts + GitHub-Actions.
- **Renovate**: Feingranulare Regeln für npm + Docker, Gruppierung, Automerge für Patch/Minor-Dev-Deps.

## Quellen
- Frontend: `/apps/frontend`
- Backend: `/apps/backend`
- Dockerfiles: `apps/*/Dockerfile`
- GHA: `.github/workflows/*.yml`

## Regeln (Kurz)
- Patch/Minor für **devDependencies** → Auto-merge nach erfolgreichem CI.
- Sicherheitsupdates → Priorität hoch, keine Automerge.
- Major-Updates → eigene PRs, keine Gruppierung, Review nötig.
- Docker-Basisimages → wöchentlich, keine Automerge.

## Risiken & Mitigation
- **Build-Brüche** durch Nebenwirkungen → CI Pflicht; Automerge nur nach grünem Status.
- **Flut an PRs** → strikte Gruppierungsregeln + Limits.
- **Breaking Changes** → keine Automerge bei Major; Labels `major` + `needs-review`.

## Validierung (nur Lesen)
- Dependabot-Config: `.github/dependabot.yml`
- Renovate-Regeln: `renovate.json`
- PR-Labels: `dependencies`, `security`, `automerge`, `major`.

**Stand:** 2025-10-17
# Beitragen

1. Branch erstellen
# Versionierung & Releases

**Schema:** Semantic VersioningÂ 2.0.0  
Format: `v<MAJOR>.<MINOR>.<PATCH>`

| Ã„nderungstyp | Beispiel | Bedeutung |
|---------------|-----------|-----------|
| BreakingÂ Change | `v2.0.0` | Inkompatible Ã„nderungen |
| Feature | `v1.1.0` | NeueÂ Funktion ohneÂ BreakingÂ Change |
| Bugfix | `v1.0.1` | Fehlerbehebung |

## Release Workflow
- GitHubâ€‘Tag `vX.Y.Z` pushen â†’Â `deploy.yml` triggertÂ Build
- DockerÂ Images â†’Â GHCR
- Rollout aufÂ Cluster â†’Â automatisch

## CHANGELOG
