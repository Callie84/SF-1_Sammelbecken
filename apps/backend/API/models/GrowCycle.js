const mongoose = require("mongoose");

const CycleEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    note: String,
    stage: String,
    images: [String],
  },
  { _id: false },
);

const GrowCycleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  strain: String,
  startDate: Date,
  expectedDurationDays: Number,
  entries: [CycleEntrySchema],
  reminders: [
    {
      date: Date,
      message: String,
      sent: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

GrowCycleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("GrowCycle", GrowCycleSchema);
