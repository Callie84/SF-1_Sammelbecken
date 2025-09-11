🔒 Admin Panel – Teil 2:
- PUT /admin/users/:id/role  → Nutzerrolle ändern (body: { role })
- DELETE /admin/users/:id    → Nutzer löschen
- POST /admin/actions/rescrape  → Seedbank-Scrape manuell auslösen
- DELETE /admin/actions/logs → Alle Admin-Logs löschen
- AdminLogService speichert jede Aktion in AdminLog