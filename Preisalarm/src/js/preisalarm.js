let alerts = [];

function loadAlerts() {
  const stored = localStorage.getItem("sf1_alerts");
  if (stored) alerts = JSON.parse(stored);
  renderAlerts();
}

function saveAlerts() {
  localStorage.setItem("sf1_alerts", JSON.stringify(alerts));
}

function addAlert() {
  const name = document.getElementById("strainName").value.trim();
  const price = parseFloat(document.getElementById("targetPrice").value);
  if (!name || isNaN(price)) return;
  alerts.push({ name, price });
  saveAlerts();
  renderAlerts();
  document.getElementById("strainName").value = "";
  document.getElementById("targetPrice").value = "";
}

function removeAlert(i) {
  alerts.splice(i, 1);
  saveAlerts();
  renderAlerts();
}

function renderAlerts() {
  const ul = document.getElementById("alertList");
  ul.innerHTML = "";
  alerts.forEach((a, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${a.name} – bis max. ${a.price.toFixed(2)} € <button onclick="removeAlert(${i})" class="text-red-500 ml-2">✖</button>`;
    ul.appendChild(li);
  });
}

window.onload = loadAlerts;
