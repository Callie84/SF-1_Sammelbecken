const fakeDB = {
  "Banana": { thc: 22, cbd: 0.5, flower: "8-9 Wochen", yield: "500g/m²" },
  "Jell-O-Nate": { thc: 24, cbd: 0.3, flower: "7-8 Wochen", yield: "550g/m²" }
};

function compare() {
  const s1 = document.getElementById('strain1').value.trim();
  const s2 = document.getElementById('strain2').value.trim();
  const r = document.getElementById('result');

  if (!fakeDB[s1] || !fakeDB[s2]) {
    r.innerHTML = "⚠️ Eine oder beide Sorten wurden nicht gefunden.";
    return;
  }

  const a = fakeDB[s1];
  const b = fakeDB[s2];

  r.innerHTML = `
    <table class="w-full text-left border">
      <thead><tr><th class="p-2 border"></th><th class="p-2 border">${s1}</th><th class="p-2 border">${s2}</th></tr></thead>
      <tbody>
        <tr><td class="p-2 border">THC</td><td class="p-2 border">${a.thc}%</td><td class="p-2 border">${b.thc}%</td></tr>
        <tr><td class="p-2 border">CBD</td><td class="p-2 border">${a.cbd}%</td><td class="p-2 border">${b.cbd}%</td></tr>
        <tr><td class="p-2 border">Blütezeit</td><td class="p-2 border">${a.flower}</td><td class="p-2 border">${b.flower}</td></tr>
        <tr><td class="p-2 border">Ertrag</td><td class="p-2 border">${a.yield}</td><td class="p-2 border">${b.yield}</td></tr>
      </tbody>
    </table>
  `;
}