const mongoose = require("mongoose");

const SetupItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  category: String,
  quantity: { type: Number, default: 1 },
  unitPrice: Number,
  purchased: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SetupItem", SetupItemSchema);
