🔖 Favoriten/Merklisten – Teil 1:
- Modell: Wishlist (name, items:Array<strain,note,addedAt>, timestamps)
- Routen (auth-geschützt):
  • GET /wishlist/lists → alle Listen
  • POST /wishlist/lists { name } → neue Liste
  • DELETE /wishlist/lists/:id → Liste löschen
  • POST /wishlist/lists/:id/items { strain, note } → Item hinzufügen
  • DELETE /wishlist/lists/:id/items/:strain → Item entfernen
- Erweitert im Teil 2: Export, Gruppen, Freigabe