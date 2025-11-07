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