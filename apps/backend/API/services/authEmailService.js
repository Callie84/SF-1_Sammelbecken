const crypto = require("crypto");
const Token = require("../models/Token");
const User = require("../models/User");
const { sendEmail } = require("./emailService");

async function createVerificationToken(userId) {
  const token = crypto.randomBytes(16).toString("hex");
  const expires = new Date(Date.now() + 24 * 3600 * 1000);
  await Token.create({ userId, token, type: "verify", expires });
  return token;
}

async function createPasswordResetToken(userId) {
  const token = crypto.randomBytes(16).toString("hex");
  const expires = new Date(Date.now() + 3600 * 1000);
  await Token.create({ userId, token, type: "reset", expires });
  return token;
}

async function sendVerificationEmail(user) {
  const token = await createVerificationToken(user._id);
  const link = `${process.env.FRONTEND_URL}/verify/${token}`;
  await sendEmail(
    user.email,
    "Verify your account",
    `Click <a href="${link}">here</a> to verify.`,
  );
}

async function sendPasswordResetEmail(user) {
  const token = await createPasswordResetToken(user._id);
  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail(
    user.email,
    "Reset your password",
    `Click <a href="${link}">here</a> to reset.`,
  );
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
