// Stub für Partner-API: Artikel suchen und in den Warenkorb legen
async function searchPartnerProducts(query) {
  // Simuliert Rückgabe von Produkten
  return [
    { id: 'p1', name: `${query} Growlicht 600W`, price: 120.00, url: 'https://partner.example.com/p1' },
    { id: 'p2', name: `${query} Belüfter`, price: 45.50, url: 'https://partner.example.com/p2' }
  ];
}

async function addToPartnerCart(userId, productId) {
  // Simuliere Hinzufügen; kein echtes Speichern
  return { userId, productId, addedAt: new Date() };
}

module.exports = { searchPartnerProducts, addToPartnerCart };