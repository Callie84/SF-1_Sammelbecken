🖥 Favoriten-Dashboard & UI-Komponente
- **API**:
  • fetchWishlist(): GET /api/wishlist/items
  • exportWishlist(): GET /api/wishlist/export
- **Component**:
  • WishlistDashboard.jsx: lädt Items, zeigt Kachel-Layout mit Strain, Note, Datum
  • Export-Button: CSV-Download via Blob
- **Page**:
  • WishlistPage.jsx: Wrapper mit Header und Dashboard
- **Styling**:
  • Tailwind CSS Klassen für Responsive Grid, Buttons, Typography
- **Integration**:
  • In App-Router einfügen: Route "/wishlist" → WishlistPage
  • Env: REACT_APP_API_URL