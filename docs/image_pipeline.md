# Bild-Pipeline & CDN

## Ziel
Bilder sicher speichern, verlustarm ausliefern, automatisch skalieren, mit Cache-Headern für CDN.

## Quellen
- **GridFS** (User-Journal) – Standard.
- **S3-kompatibel** (optional) – für Off-Site/Backups.

## Endpunkt
`GET /img/:id?w=..&h=..&q=..&fmt=webp|jpeg|png&fit=cover|contain&sig=HMAC`

## Limits & Sicherheit
- Max: `w,h <= 3000`. Quality `q 30–95`.
- Nur `webp|jpeg|png`.
- **Signatur (HMAC-SHA256)** mit `IMG_SECRET`. Anfrage ohne gültige `sig` → 403.
- Alle Antworten mit Cache-Headern:
  - `Cache-Control: public, max-age=31536000, immutable` (bei unveränderlichen IDs)
  - `ETag` und `Last-Modified`.

## Speicherwahl
- Env `IMAGE_STORE=gridfs|s3`. Default `gridfs`.
- S3 braucht: `S3_ENDPOINT,S3_BUCKET,S3_REGION,S3_ACCESS_KEY,S3_SECRET_KEY`.

## CDN
- Subdomain **img.seedfinderpro.de** zeigt auf `/img/*`.
- CDN/Proxy darf unbegrenzt cachen (wegen `immutable` + ID-basiertem Pfad).

## Fehlerfälle
- Quelle fehlt → 404.
- Param-Fehler → 400.
- Verarbeitung schlägt fehl → 500 (mit Log).

**Stand:** 2025-10-17
