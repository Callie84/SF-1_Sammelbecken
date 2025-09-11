const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Sendet Nutzer-Nachricht an OpenAI und erhält Antwort
async function sendChatMessage(userId, message) {
  // Optional: kontextuelle Historie aus Message-Modell holen
  const prompt = `User fragt: ${message}\nAntworte kompetent basierend auf dem SF-1 System.`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });
  return response.choices[0].message.content;
}

module.exports = { sendChatMessage };