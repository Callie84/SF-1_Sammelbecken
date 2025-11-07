# Secrets-Rotation Policy

## Verantwortlichkeiten
- Projektleitung: Freigabe der Rotation.
- DevOps: Generierung, Versiegelung, Deploy, Verifikation.
- Security: Review der PRs, Audit-Log.

## Zeitplan
- Quartalsweise für 90-Tage-Secrets.
- Halbjährlich für 180-Tage-Secrets.
- Ad-hoc nach Incidents.

## Prozess (DoD)
- Neue Secrets generiert (`scripts/rotate_secrets.ps1`).
- Pending-Dateien lokal, **nicht** ins Repo.
- Versiegelt (`kubeseal`) nach `k8s/secrets/sealed/`.
- PR mit Review durch Security.
- Nach Merge: Deploy + Validierung.
- Post-Mortem-Notiz in `docs/recovery_postmortem.md`.

## Namens- und Pfadkonventionen
- Pending: `k8s/secrets/pending/`
- Sealed: `k8s/secrets/sealed/`
- Secret-Name PROD: `sf1-secrets`
- Secret-Name STAGING: `sf1-secrets-staging`

## Rollback
- Vorherige `*.sealed.yaml` im Repo behalten.
- Bei Problemen: älteres SealedSecret erneut anwenden (Dokumentation).

**Stand:** 2025-10-17
