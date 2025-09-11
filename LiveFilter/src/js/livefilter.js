const items = [
  { name: "Banana", category: "Indica" },
  { name: "Jell-O-Nate", category: "Hybrid" },
  { name: "Amnesia Haze", category: "Sativa" },
  { name: "Gorilla Glue", category: "Hybrid" },
  { name: "Northern Lights", category: "Indica" }
];

function render(items) {
  const list = document.getElementById("resultList");
  list.innerHTML = items.map(i => \`<div class="border-b pb-2"><strong>\${i.name}</strong> – \${i.category}</div>\`).join('');
}

document.getElementById("filterInput").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  render(filtered);
});

window.onload = () => render(items);