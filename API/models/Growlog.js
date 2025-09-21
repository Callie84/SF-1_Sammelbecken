const mongoose = require("mongoose");

const GrowlogEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    note: String,
    stage: String,
    images: [String],
  },
  { _id: false },
);

const GrowlogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  strain: String,
  startedAt: Date,
  entries: [GrowlogEntrySchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Growlog", GrowlogSchema);
