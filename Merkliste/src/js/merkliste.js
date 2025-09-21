let savedStrains = [];

function loadStrains() {
  const stored = localStorage.getItem("sf1_merkliste");
  if (stored) savedStrains = JSON.parse(stored);
  renderList();
}

function saveStrains() {
  localStorage.setItem("sf1_merkliste", JSON.stringify(savedStrains));
}

function addStrain() {
  const input = document.getElementById("strainInput");
  const value = input.value.trim();
  if (!value) return;
  savedStrains.push(value);
  input.value = "";
  saveStrains();
  renderList();
}

function removeStrain(index) {
  savedStrains.splice(index, 1);
  saveStrains();
  renderList();
}

function renderList() {
  const list = document.getElementById("strainList");
  list.innerHTML = "";
  savedStrains.forEach((s, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${s} <button onclick="removeStrain(${i})" class="text-red-500 ml-2">✖</button>`;
    list.appendChild(li);
  });
}

window.onload = loadStrains;
