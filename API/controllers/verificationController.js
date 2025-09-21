const Token = require("../models/Token");
const User = require("../models/User");

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  const record = await Token.findOne({
    token,
    type: "verify",
    expires: { $gt: new Date() },
  });
  if (!record)
    return res.status(400).json({ error: "Invalid or expired token" });
  const user = await User.findByIdAndUpdate(record.userId, { verified: true });
  await record.delete();
  res.json({ message: "Email verified" });
};
