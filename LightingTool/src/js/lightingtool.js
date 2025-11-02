function calcPower() {
  const watt = parseFloat(document.getElementById("watt").value);
  const lampen = parseFloat(document.getElementById("lampen").value);
  const stunden = parseFloat(document.getElementById("stunden").value);
  const tage = parseFloat(document.getElementById("tage").value);
  const kwh = parseFloat(document.getElementById("kwh").value);

  if (
    isNaN(watt) ||
    isNaN(lampen) ||
    isNaN(stunden) ||
    isNaN(tage) ||
    isNaN(kwh)
  ) {
    document.getElementById("ergebnis").textContent =
      "❗ Bitte alle Felder korrekt ausfüllen.";
    return;
  }

  const verbrauchKWh = (watt * lampen * stunden * tage) / 1000;
  const kosten = verbrauchKWh * kwh;

  document.getElementById("ergebnis").innerHTML = `
    🔋 Verbrauch: <strong>${verbrauchKWh.toFixed(2)} kWh</strong><br>
    💶 Kosten: <strong>${kosten.toFixed(2)} €</strong>
  `;
}
