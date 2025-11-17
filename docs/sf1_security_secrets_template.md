# SF-1 — Security & Secrets (Template) (Stand: 2025-11-01)

## 1. Grundsatz
- Keine echten Secrets im Git-Repo.
- Secrets immer über Kubernetes-Secrets, **SealedSecrets** oder CI-Secret einspielen.
- GPTs dürfen Secret-NAMEN verwenden, aber niemals Werte ausgeben.

## 2. App-relevante Secrets
| Name          | Zweck                                   | Verwendet in                           |
|---------------|-----------------------------------------|-----------------------------------------|
| MONGO_URI     | Verbindung zur MongoDB                  | apps/backend/, apps/price-service/      |
| JWT_SECRET    | Signierung von JWT für Auth             | apps/backend/src/routes/auth.ts         |
| AFFILIATE_KEY | Tracking/Partnerdaten für Affiliate     | apps/backend/src/routes/affiliate.ts    |
| ANALYTICS_KEY | Analytics/Plausible                     | apps/backend/src/routes/analytics.ts    |

## 3. Kubernetes-/Cluster-Secrets
Diese Dateien/Manifeste existieren, enthalten aber keine echten Werte:
- `k8s/secrets.yaml`
- `k8s/secrets/rotation_policy.md`
- `k8s/secrets/sealedsecret-api.yml`
- `k8s/secrets/sealedsecret-s3.yml`
- `k8s/secrets/sealedsecret-alerts.yml`

**Regel:** In Doku nur referenzieren, nicht befüllen.

## 4. Backup-/S3-Secrets (aus k8s/backup/)
- `k8s/backup/10-secret-s3.yaml` ? Zugang zu S3/Bucket
- `k8s/backup/11-secret-mongo.yaml` ? Zugang für Mongo-Dumps
- `k8s/backup/12-secret-rsync.yaml` ? Zugang für Datei-Sync
Diese drei dürfen **nie** mit Klartext im Repo oder in GPT-Antworten stehen.

## 5. Rotation
- Vorgaben stehen in: `docs/secrets_rotation.md`
- Ziel: Rotation mindestens 1× pro Quartal
- SealedSecrets bevorzugen, wenn Keys verteilt werden müssen

## 6. Vorgaben für GPTs
- Wenn YAML generiert wird: Platzhalter wie `<set-via-sealedsecret>` verwenden.
- Wenn PowerShell generiert wird: nur zeigen, **wo** das Secret eingespielt wird, nicht den Wert.
- Keine Beispiel-Passwörter, keine Tokens, keine realen URLs mit Token.

## 7. Nächste Aktion
- Aktuelle Secret-Namen aus dem laufenden Cluster auslesen
- Liste oben erweitern
