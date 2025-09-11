const Review = require("../models/Review");
const { logAction } = require("../services/adminLogService");

// Bewertung löschen (Admin)
exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  await logAction(req.user.id, "DELETE_REVIEW", { reviewId: req.params.id });
  res.json({ message: "Bewertung gelöscht" });
};