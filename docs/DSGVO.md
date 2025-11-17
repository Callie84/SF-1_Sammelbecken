# DSGVO â€“ SeedFinder PRO

## Datenarten
- Konto: Eâ€‘Mail, Passwortâ€‘Hash, Rollen, Favoriten
- Nutzungsdaten: Eventâ€‘Aggregationen (anonymisiert), keine PII
- Inhalte: Journalâ€‘EintrÃ¤ge der Nutzer (freiwillig)

## Rechtsgrundlage
- Art. 6 Abs. 1 lit. b DSGVO (VertragserfÃ¼llung, Nutzerkonto)
- Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: Betrieb/Analytics ohne PII)

## Speicherfristen
- Kontodaten bis LÃ¶schung; Journal-Inhalte bis Nutzer lÃ¶scht
- Logs max. 30 Tage, IPs anonymisiert/gehasted

## Betroffenenrechte
- Auskunft, Berichtigung, LÃ¶schung, EinschrÃ¤nkung, DatenÃ¼bertragbarkeit, Widerspruch
- Export: `/api/user/export` liefert JSON
- LÃ¶schung: `/api/user` (Softâ†’Hard nach 30 Tagen)

## Auftragsverarbeiter
- Netcup (Hosting), ggf. Eâ€‘Mailâ€‘Provider, optional CDN

## Sicherheit
- TLS, Ruhende Daten: PasswÃ¶rter Argon2id; Secrets in K8s
- Zugriff: Rollenmodell; Protokollierung ohne PII