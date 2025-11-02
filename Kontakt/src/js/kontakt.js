document.getElementById("supportForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("feedback").classList.remove("hidden");
  this.reset();
});
