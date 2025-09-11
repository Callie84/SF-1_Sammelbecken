💾 Backup & Export – Teil 1:
- Service: export-all JSON & CSV pro Collection
- Endpunkte:
  • GET /export/json → komplette Datenbank als JSON-Datei
  • GET /export/csv?collection=<name> → CSV nur für eine Collection (z.B. users, growlogs)
- Export-Pfad: /exports/<file>
- Auth erforderlich