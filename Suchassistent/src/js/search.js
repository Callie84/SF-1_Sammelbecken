const strains = [
  "Banana",
  "Jell-O-Nate",
  "Gorilla Glue",
  "Amnesia Haze",
  "White Widow",
  "Blueberry",
  "Purple Haze"
];

document.getElementById('searchInput').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const suggestions = strains.filter(s => s.toLowerCase().includes(query)).slice(0, 5);
  const box = document.getElementById('suggestions');
  box.innerHTML = '';
  if (suggestions.length === 0 || query === '') {
    box.classList.add('hidden');
    return;
  }
  suggestions.forEach(s => {
    const div = document.createElement('div');
    div.className = 'autocomplete-suggestion';
    div.textContent = s;
    div.onclick = () => selectStrain(s);
    box.appendChild(div);
  });
  box.classList.remove('hidden');
});

function selectStrain(strain) {
  document.getElementById('searchInput').value = strain;
  document.getElementById('suggestions').classList.add('hidden');
  document.getElementById('infoBox').textContent = `ℹ️ Informationen zu ${strain} anzeigen...`;
}