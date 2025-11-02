📝 Wunschliste – Teil 3:
- **Bulk-Import**:
  • importWishlistFromCSV(userId): Liest data/wishlist_import.csv (strain, note), fügt Items hinzu  
  • Route: POST /wishlist/import (Admin-only)  
- **CSV-Export**:
  • exportWishlistCSV(userId): Export der aktuellen Items  
  • Route: GET /wishlist/export (User)  
- **CSV-Format**:
  • Import: columns strain, note  
  • Export: columns strain, note, addedAt