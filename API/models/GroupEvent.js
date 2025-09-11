const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rsvp: { type: Boolean, default: false }
}, { _id: false });

const GroupEventSchema = new mongoose.Schema({
  type: { type: String, enum: ['group', 'event'], required: true },
  name: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  participants: [ParticipantSchema],
  eventDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupEvent', GroupEventSchema);