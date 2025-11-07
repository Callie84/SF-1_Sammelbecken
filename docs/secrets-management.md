# Secretsâ€‘Management (Sealed Secrets)

## Zweck
Secrets sollen im **Gitâ€‘Repo versioniert** werden kÃ¶nnen, **ohne** geheime Inhalte im Klartext. Mit **Sealed Secrets** werden aus normalen Kubernetesâ€‘Secrets **verschlÃ¼sselte** CRs (`SealedSecret`) erzeugt, die nur der Controller im Cluster entschlÃ¼sseln kann.

## Begriffe
- **Secret**: Kubernetesâ€‘Objekt mit sensiblen Werten (Base64, nicht verschlÃ¼sselt).
- **SealedSecret**: VerschlÃ¼sselte Form. Sicher fÃ¼r Git.
- **Sealing Key**: Clusterâ€‘Privatkey. VerlÃ¤sst den Cluster nicht.

## Vorgehen (Ãœbersicht)
1. Lokales Secret als YAML vorbereiten (ohne Commit).
2. Mit dem **Ã¶ffentlichen Zertifikat** des Controllers verschlÃ¼sseln â†’ `SealedSecret`.
3. **Nur** `SealedSecret` ins Repo committen.
4. Im Cluster stellt der Controller daraus das normale `Secret` bereit.

## Geltungsbereich
- APIâ€‘Credentials (DB, JWT, SMTP),
- S3/Backupâ€‘ZugÃ¤nge,
- Alertmanagerâ€‘EmpfÃ¤nger (Eâ€‘Mail, Slack),
- Blackbox Basicâ€‘Auth, etc.

## Rotation
- Alten Wert im Cluster Ã¤ndern â†’ neues `SealedSecret` erzeugen â†’ committen â†’ deployen.

## Risiken & Mitigation
- **Keyverlust** des Controllers: RegelmÃ¤ÃŸiges Controllerâ€‘Keyâ€‘Backup (Clusterâ€‘Admin).
- **Falscher Namespace/Name**: Beim Sealen **Namespace** und **Name** exakt setzen.
- **KompatibilitÃ¤t**: `kubeseal` Version passend zum Controller verwenden.

## Status & NÃ¤chste Aktion
**Status:** Artefakte vorhanden.  
**NÃ¤chste Aktion:** Zertifikat vom Controller holen, lokale Secrets versiegeln, `SealedSecret`â€‘YAMLs committen.