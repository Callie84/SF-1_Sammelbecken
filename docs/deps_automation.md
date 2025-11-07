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
