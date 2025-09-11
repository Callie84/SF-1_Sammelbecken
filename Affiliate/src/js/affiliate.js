const affiliateLinks = {
  seeds: [
    { name: "Zamnesia", url: "https://zamnesia.com?aff=sf1" },
    { name: "Royal Queen Seeds", url: "https://royalqueenseeds.de?aff=sf1" }
  ],
  light: [
    { name: "Spider Farmer", url: "https://spider-farmer.com?aff=sf1" },
    { name: "Mars Hydro", url: "https://mars-hydro.com?aff=sf1" }
  ],
  grow: [
    { name: "Growland", url: "https://growland.net?aff=sf1" },
    { name: "Hydroponics Europe", url: "https://hydroponics.eu?aff=sf1" }
  ],
  shop: [
    { name: "Amazon", url: "https://amazon.de/grow?aff=sf1" },
    { name: "eBay", url: "https://ebay.de/grow?aff=sf1" }
  ]
};

function loadAffiliate() {
  const ctx = document.getElementById('contextSelect').value;
  const box = document.getElementById('affiliateBox');
  const links = affiliateLinks[ctx] || [];
  box.innerHTML = links.map(l => \`<a href="\${l.url}" target="_blank" class="block text-blue-600 hover:underline mb-1">🔗 \${l.name}</a>\`).join('');
}

window.onload = loadAffiliate;