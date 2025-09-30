const UploadedSeed = require("../models/UploadedSeed");
const { logAction } = require("../services/adminLogService");

// Admin genehmigt oder lehnt Upload ab
exports.reviewUpload = async (req, res) => {
  const { id } = req.params;
  const { approved, feedback } = req.body;
  const upload = await UploadedSeed.findById(id);
  if (!upload) return res.status(404).json({ error: "Upload nicht gefunden" });

  upload.moderation = { approved, feedback, reviewedAt: new Date() };
  await upload.save();

  // Admin-Aktion loggen
  await logAction(
    req.user.id,
    approved ? "UPLOAD_APPROVED" : "UPLOAD_REJECTED",
    { uploadId: id, feedback },
  );

  res.json(upload);
};

// Nutzer holt Status seiner Uploads
exports.getStatus = async (req, res) => {
  const uploads = await UploadedSeed.find({ userId: req.user.id }).select(
    "strain moderation",
  );
  res.json(uploads);
};
