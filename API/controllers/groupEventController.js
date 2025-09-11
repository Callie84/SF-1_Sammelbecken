const GroupEvent = require('../models/GroupEvent');

// Gruppe oder Event erstellen
exports.createGE = async (req, res) => {
  const data = { ...req.body, owner: req.user.id };
  const ge = new GroupEvent(data);
  await ge.save();
  res.status(201).json(ge);
};

// Liste aller Gruppen & Events
exports.listGE = async (req, res) => {
  const list = await GroupEvent.find();
  res.json(list);
};

// Mitglied einem Gruppe/Event hinzufügen
exports.joinGE = async (req, res) => {
  const ge = await GroupEvent.findById(req.params.id);
  if (!ge) return res.status(404).json({ error: 'Nicht gefunden' });
  if (ge.type === 'group') {
    ge.members.push(req.user.id);
  } else {
    ge.participants.push({ userId: req.user.id, rsvp: true });
  }
  await ge.save();
  res.json(ge);
};

// RSVP für Event ändern
exports.rsvpEvent = async (req, res) => {
  const ge = await GroupEvent.findById(req.params.id);
  if (!ge || ge.type !== 'event') return res.status(404).json({ error: 'Event nicht gefunden' });
  const part = ge.participants.find(p => p.userId.toString() === req.user.id);
  if (part) {
    part.rsvp = req.body.rsvp;
  } else {
    ge.participants.push({ userId: req.user.id, rsvp: req.body.rsvp });
  }
  await ge.save();
  res.json(ge);
};