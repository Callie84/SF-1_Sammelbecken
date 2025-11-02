const data = {
  Zamnesia: [],
  "Royal Queen Seeds": [],
  "Sensi Seeds": [],
};

function renderReviews(bank) {
  const container = document.getElementById("reviews");
  const reviews = data[bank];
  container.innerHTML =
    "<h2 class='font-semibold mb-2'>Kommentare zu " + bank + ":</h2>";
  if (reviews.length === 0) {
    container.innerHTML +=
      "<p class='text-sm text-gray-500'>Noch keine Bewertungen.</p>";
  } else {
    reviews.forEach((r) => {
      container.innerHTML +=
        "<div class='mb-2 p-2 border rounded'><p>" +
        r.comment +
        "</p><p class='text-yellow-600 text-xs'>" +
        "⭐".repeat(r.rating) +
        "</p></div>";
    });
  }
}

document.getElementById("bankSelect").addEventListener("change", function () {
  renderReviews(this.value);
});

document.getElementById("reviewForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const bank = document.getElementById("bankSelect").value;
  const comment = document.getElementById("comment").value.trim();
  const rating = parseInt(document.getElementById("rating").value);
  if (!comment || !rating) return;
  data[bank].push({ comment, rating });
  this.reset();
  renderReviews(bank);
});

window.onload = () => {
  renderReviews(document.getElementById("bankSelect").value);
};
