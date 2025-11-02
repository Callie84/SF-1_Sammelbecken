const { generateMfaSecret, verifyMfaToken } = require("../services/mfaService");
const User = require("../models/User");

exports.enableMfa = async (req, res) => {
  const url = await generateMfaSecret(req.user);
  res.json({ otpauth_url: url });
};

exports.verifyMfa = async (req, res) => {
  const { token } = req.body;
  const isValid = await verifyMfaToken(req.user, token);
  if (!isValid) return res.status(400).json({ error: "Ungültiges MFA-Token" });
  req.user.mfaEnabled = true;
  await User.findByIdAndUpdate(req.user.id, { mfaEnabled: true });
  res.json({ message: "MFA aktiviert" });
};
