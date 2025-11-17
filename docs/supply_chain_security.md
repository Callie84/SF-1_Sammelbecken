# Supply-Chain Security für SF-1

Ziel: Manipulation an Code, Builds und Images verhindern bzw. schnell entdecken. Fokus: reproduzierbare Builds, nachvollziehbare Images, SBOM & Signaturen, strenge Admission-Policies.

## Maßnahmen (Überblick)
1. **SBOM pro Image** (SPDX) automatisch erzeugen und als **OCI-Attestation** anhängen.
2. **Keyless Signaturen mit Cosign** aus GitHub Actions (OIDC).
3. **Kyverno-Policies**: 
   - Keine `:latest`-Tags.
   - Nur Registry **ghcr.io** und Org **${OWNER}**.
   - Basis-Hardening (runAsNonRoot, readOnlyRootFilesystem).
4. **Review-Pflicht**: Änderungen an `k8s/*` nur via Pull Request.
5. **Release-Tags**: semantische Versionen; `stable` nur durch Release-Workflow.

## Build-Pipeline (vereinfacht)
- Docker Build & Push → `ghcr.io/<owner>/sf1-frontend` und `.../sf1-backend`.
- SBOM erzeugen (Syft) → `*.spdx.json`.
- Cosign Attestation (`--type spdx`) an das Image anhängen (keyless, OIDC).
- Artefakte archivieren (SBOM + Build-Logs).

## Kyverno Admission
- Verhindert Deployments mit `:latest`.
- Erzwingt Registry `ghcr.io/<owner>/*`.
- Erzwingt SecurityContext: `runAsNonRoot: true`, `readOnlyRootFilesystem: true`.

## Risiken & Mitigation
- **Fehlende Metriken/CRDs** → Policies greifen nicht: Kyverno/metrics prüfen.
- **Private Repos/Images** → GHCR Login nötig: ImagePullSecret hinterlegen.
- **Canary/Blue-Green mismatch** → Policies blockieren falsche Tags. Lösung: gleiche Regeln für alle Farb-Deployments.

## Validierung (nur Lesen)
- SBOM vorhanden: `cosign verify-attestation --type spdx ghcr.io/<owner>/sf1-backend:stable`
- Kyverno aktiv: `kubectl get cpol`
- Policy-Treffer: `kubectl get events -A | findstr Denied` (Windows) / `grep` (Linux)

**Stand:** 2025-10-17
