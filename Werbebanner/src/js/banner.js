const ads = [
  {
    text: "ðŸŒ± Hol dir 10% Rabatt bei Zamnesia!",
    url: "https://www.zamnesia.com?aff=sf1",
  },
  {
    text: "ðŸ’¡ Grow-Licht gesucht? Spider Farmer Deals jetzt online!",
    url: "https://www.spider-farmer.com?aff=sf1",
  },
  {
    text: "ðŸŒ¿ Neue Genetiken bei Royal Queen Seeds entdecken!",
    url: "https://www.royalqueenseeds.de?aff=sf1",
  },
  { text: "âš¡ Strom sparen beim Grow mit SF-1 Tipps!", url: "#" },
];

let index = 0;
function rotateAd() {
  const ad = ads[index];
  const bar = document.getElementById("adBar");
  bar.innerHTML = `<a href="\${ad.url}" target="_blank" class="text-blue-700 hover:underline">\${ad.text}</a>`;
  index = (index + 1) % ads.length;
}
setInterval(rotateAd, 10000);
window.onload = rotateAd;
