const mongoose = require("mongoose");

const UserExtensionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  favorites: [String],
  premium: { type: Boolean, default: false },
});

module.exports = mongoose.model("UserExtension", UserExtensionSchema);
