let seeds = [];
let showFavs = false;

async function loadSeeds() {
  try {
    const response = await fetch("SF1_Seed_Datenbank_FULL.json");
    seeds = await response.json();
    renderSeeds(seeds);
    buildOptions(
      "seedbankFilter",
      seeds.map((s) => s.seedbank),
    );
    buildOptions(
      "geneticFilter",
      seeds.map((s) => s.genetics),
    );
    buildOptions(
      "flowerFilter",
      seeds.map((s) => s.flowering_time),
    );
    buildOptions(
      "yieldFilter",
      seeds.map((s) => s.indoor_yield),
    );
  } catch (err) {
    console.error("Fehler beim Laden der Daten:", err);
  }
}

function buildOptions(id, values) {
  const select = document.getElementById(id);
  const unique = [...new Set(values)].sort();
  unique.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}

function toggleFav(strain) {
  let favs = JSON.parse(localStorage.getItem("favs") || "[]");
  if (favs.includes(strain)) {
    favs = favs.filter((s) => s !== strain);
  } else {
    favs.push(strain);
  }
  localStorage.setItem("favs", JSON.stringify(favs));
  filterSeeds();
}

function isFav(strain) {
  const favs = JSON.parse(localStorage.getItem("favs") || "[]");
  return favs.includes(strain);
}

function toggleViewFavs() {
  showFavs = !showFavs;
  document.getElementById("favToggle").textContent = showFavs
    ? "Alle anzeigen"
    : "Nur Favoriten";
  filterSeeds();
}

function renderSeeds(data) {
  const tbody = document.getElementById("seedTable");
  tbody.innerHTML = "";
  data.forEach((item) => {
    const favIcon = isFav(item.strain) ? "⭐" : "☆";
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-100";
    row.innerHTML = `
          <td class="border px-2 py-1 cursor-pointer text-xl text-center" onclick="toggleFav('${item.strain}')">${favIcon}</td>
          <td class="border px-2 py-1">${item.strain}</td>
          <td class="border px-2 py-1">${item.seedbank}</td>
          <td class="border px-2 py-1">${item.genetics}</td>
          <td class="border px-2 py-1">${item.thc}%</td>
          <td class="border px-2 py-1">${item.cbd}%</td>
          <td class="border px-2 py-1">${item.flowering_time}</td>
          <td class="border px-2 py-1">${item.indoor_yield}</td>
          <td class="border px-2 py-1">${item.price_per_pack.map((p) => `${p.pack_size} Stk: ${p.price_eur.toFixed(2)} €`).join("<br>")}</td>
          <td class="border px-2 py-1 text-center"><a href="${item.url}" target="_blank" class="text-blue-600 hover:underline">Shop</a></td>
        `;
    tbody.appendChild(row);
  });
}

function filterSeeds() {
  const query = document.getElementById("search").value.toLowerCase();
  const minThc = parseFloat(document.getElementById("minThc").value) || 0;
  const maxThc = parseFloat(document.getElementById("maxThc").value) || 100;
  const minCbd = parseFloat(document.getElementById("minCbd").value) || 0;
  const maxCbd = parseFloat(document.getElementById("maxCbd").value) || 100;
  const seedbank = document.getElementById("seedbankFilter").value;
  const genetics = document.getElementById("geneticFilter").value;
  const flower = document.getElementById("flowerFilter").value;
  const yieldF = document.getElementById("yieldFilter").value;
  const favs = JSON.parse(localStorage.getItem("favs") || "[]");

  const result = seeds.filter(
    (s) =>
      s.strain.toLowerCase().includes(query) &&
      s.thc >= minThc &&
      s.thc <= maxThc &&
      s.cbd >= minCbd &&
      s.cbd <= maxCbd &&
      (seedbank === "" || s.seedbank === seedbank) &&
      (genetics === "" || s.genetics === genetics) &&
      (flower === "" || s.flowering_time === flower) &&
      (yieldF === "" || s.indoor_yield === yieldF) &&
      (!showFavs || favs.includes(s.strain)),
  );

  renderSeeds(result);
}

window.onload = loadSeeds;
