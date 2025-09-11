const map = L.map('map').setView([51.1657, 10.4515], 5); // Deutschland zentriert

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 18,
}).addTo(map);

const seedbanks = [
  { name: "Zamnesia", coords: [52.3702, 4.8952], url: "https://zamnesia.com" },
  { name: "Royal Queen Seeds", coords: [41.3851, 2.1734], url: "https://royalqueenseeds.de" },
  { name: "Sensi Seeds", coords: [52.374, 4.8897], url: "https://sensiseeds.com" }
];

seedbanks.forEach(sb => {
  L.marker(sb.coords)
    .addTo(map)
    .bindPopup(`<strong>${sb.name}</strong><br><a href='${sb.url}' target='_blank'>Zur Website</a>`);
});