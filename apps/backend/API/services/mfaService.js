const speakeasy = require("speakeasy");
const User = require("../models/User");

async function generateMfaSecret(user) {
  const secret = speakeasy.generateSecret({ length: 20 });
  user.mfaSecret = secret.base32;
  await user.save();
  return secret.otpauth_url;
}

async function verifyMfaToken(user, token) {
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: "base32",
    token,
    window: 1,
  });
  return verified;
}

module.exports = { generateMfaSecret, verifyMfaToken };
