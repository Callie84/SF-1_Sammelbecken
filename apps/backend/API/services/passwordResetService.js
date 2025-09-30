const crypto = require("crypto");
const User = require("../models/User");
// Placeholder for email sending, integrate nodemailer or similar
async function generatePasswordResetToken(user) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 3600000; // 1 hour
  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  await user.save();
  // TODO: send email with token link: `${process.env.FRONTEND_URL}/reset/${token}`
  return token;
}

async function resetPassword(token, newPassword) {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token ungültig oder abgelaufen");
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return user;
}

module.exports = { generatePasswordResetToken, resetPassword };
