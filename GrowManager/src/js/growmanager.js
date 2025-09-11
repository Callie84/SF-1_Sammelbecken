let currentDay = 1;

function addDay() {
  const container = document.getElementById('growLogContainer');
  const entry = document.createElement('div');
  entry.className = 'p-4 bg-white shadow rounded';
  entry.innerHTML = `
    <h2 class="font-semibold mb-2">Tag ${currentDay}</h2>
    <textarea class="w-full p-2 border rounded mb-2" rows="4" placeholder="Notizen..."></textarea>
    <label class="block mb-1">Gegossen?</label>
    <input type="checkbox" class="mb-2" />
    <label class="block mb-1">Dünger:</label>
    <input type="text" class="w-full p-2 border rounded" placeholder="z. B. Terra Bloom 2ml/l" />
  `;
  container.appendChild(entry);
  currentDay++;
}