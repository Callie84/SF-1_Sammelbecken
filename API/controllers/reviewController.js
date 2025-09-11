const Review = require("../models/Review");

exports.addReview = async (req, res) => {
  const { shopId, rating, comment } = req.body;
  const review = new Review({ shopId, userId: req.user.id, rating, comment });
  await review.save();
  res.status(201).json(review);
};

exports.listReviews = async (req, res) => {
  const reviews = await Review.find({ shopId: req.params.shopId });
  res.json(reviews);
};