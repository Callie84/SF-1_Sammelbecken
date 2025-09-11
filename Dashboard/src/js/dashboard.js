const status = [
  "✅ SeedFinder & Preisvergleich bereit",
  "✅ GrowManager PRO aktiv",
  "✅ Licht- & Stromrechner integriert",
  "✅ Favoritenmodul eingebaut",
  "✅ Werbeeinbindung läuft",
  "📦 Dashboard wird geladen..."
];

const progress = 6;
const total = 30;

function renderStatus() {
  const list = document.getElementById('statusList');
  status.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });

  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const percent = Math.round((progress / total) * 100);
  progressBar.style.width = percent + '%';
  progressText.textContent = `${progress} / ${total} Module (${percent}%)`;
}

window.onload = renderStatus;