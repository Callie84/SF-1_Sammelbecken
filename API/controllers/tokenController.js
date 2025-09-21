const {
  generateAccessToken,
  verifyRefreshToken,
} = require("../services/tokenService");
const User = require("../models/User");

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(401).json({ error: "Kein Refresh-Token übergeben" });

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "Nutzer nicht gefunden" });

    const newAccessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Ungültiger Refresh-Token" });
  }
};
