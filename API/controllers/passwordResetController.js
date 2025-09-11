const Token = require('../models/Token');
const User = require('../models/User');

exports.requestReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Email not found' });
  await require('../services/authEmailService').sendPasswordResetEmail(user);
  res.json({ message: 'Reset email sent' });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const record = await Token.findOne({ token, type: 'reset', expires: { $gt: new Date() } });
  if (!record) return res.status(400).json({ error: 'Invalid or expired token' });
  const user = await User.findById(record.userId);
  user.passwordHash = password;
  await user.save();
  await record.delete();
  res.json({ message: 'Password updated' });
};