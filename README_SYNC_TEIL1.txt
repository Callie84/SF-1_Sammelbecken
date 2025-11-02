🔄 Favoriten-Sync – Teil 1:
- Modell: FavoriteItem (userId, strain, note, updatedAt, deletedAt)
- GET /favorites/sync?since=<ISO-Date> → gibt geänderte Items zurück + serverTime
- POST /favorites/sync → sendet array 'changes': [{ strain, note, deleted, timestamp }]
- Rückgabe: serverTime + 'synced' array der verarbeiteten Items
- Auth nötig (JWT)