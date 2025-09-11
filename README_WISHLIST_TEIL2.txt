🔖 Favoriten/Merklisten – Teil 2:
- **Export** (CSV):
  • GET /wishlist/export/:id → exportiert Items einer Liste als CSV-Datei
- **Gruppenverwaltung**:
  • GET /groups → alle Gruppen mit Wishlists
  • POST /groups { name } → Gruppe erstellen
  • POST /groups/:groupId/add { wishlistId } → Liste zu Gruppe hinzufügen
  • POST /groups/:groupId/remove/:wishlistId → Liste aus Gruppe entfernen
  • DELETE /groups/:groupId → Gruppe löschen
- **Freigabe/Share**:
  • POST /wishlist/share/:id → generiert Token & Link (7 Tage gültig)
  • GET /wishlist/share/:token → gibt Liste als JSON zurück
- Modelle:
  • Group (userId, name, wishlistIds, createdAt)
  • Wishlist (erweitert um shareToken, shareExpires)