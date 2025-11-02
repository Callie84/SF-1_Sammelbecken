let favs = [];

function loadFavs() {
  const stored = localStorage.getItem("sf1_favs");
  if (stored) favs = JSON.parse(stored);
  renderFavs();
}

function saveFavs() {
  localStorage.setItem("sf1_favs", JSON.stringify(favs));
}

function addFav() {
  const input = document.getElementById("favInput");
  const val = input.value.trim();
  if (!val || favs.includes(val)) return;
  favs.push(val);
  input.value = "";
  saveFavs();
  renderFavs();
}

function removeFav(i) {
  favs.splice(i, 1);
  saveFavs();
  renderFavs();
}

function renderFavs() {
  const ul = document.getElementById("favList");
  ul.innerHTML = "";
  favs.forEach((f, i) => {
    const li = document.createElement("li");
    li.innerHTML =
      f +
      ` <button onclick="removeFav(${i})" class="text-red-500 ml-2">✖</button>`;
    ul.appendChild(li);
  });
}

window.onload = loadFavs;
