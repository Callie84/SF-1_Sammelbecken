# ArchitekturÃ¼bersicht

**Gesamtsystem:**
- Frontend (ReactÂ +Â ViteÂ +Â PWA)
- Backend (NodeÂ +Â ExpressÂ +Â MongoDB)
- ScraperÂ Module (NodeÂ +Â CheerioÂ +Â Axios)
- Datenbank: MongoDBÂ (AtlasÂ /Â lokalÂ /Â Cluster)
- Monitoring: GrafanaÂ +Â PrometheusÂ +Â Loki
- Backup: CronJobsÂ +Â S3
- CI/CD: GitHubÂ Actions â†’ GHCR â†’Â Kubernetes
- Domain: `seedfinderpro.de`
