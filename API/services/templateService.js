const path = require('path');
const fs = require('fs');

// Lade vordefinierte Raum-Templates
function listRoomTemplates() {
  const file = path.join(__dirname, '../data/roomTemplates.json');
  const raw = fs.readFileSync(file);
  return JSON.parse(raw);
}

// Hole ein Template nach ID
function getRoomTemplate(id) {
  const templates = listRoomTemplates();
  return templates.find(t => t.id === id);
}

module.exports = { listRoomTemplates, getRoomTemplate };