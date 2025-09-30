// Erweiterung um Feedback-Feld
const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    correct: Boolean,
    comment: String,
    date: Date,
  },
  { _id: false },
);

const DiagnosisSchema = new mongoose.Schema(
  {
    // ... existierende Felder ...
    feedback: FeedbackSchema,
  },
  { strict: false },
);

module.exports = mongoose.model("Diagnosis", DiagnosisSchema);
