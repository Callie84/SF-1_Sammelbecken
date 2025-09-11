const { sendChatMessage } = require('../services/chatbotService');

// POST /chatbot/message
exports.chat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Nachricht fehlt' });
  try {
    const reply = await sendChatMessage(req.user.id, message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};