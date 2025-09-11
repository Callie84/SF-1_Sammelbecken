const mongoose = require('mongoose');

const ItemPlacementSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'SetupItem' },
  position: { x: Number, y: Number, width: Number, height: Number }
}, { _id: false });

const RoomLayoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  width: Number,
  length: Number,
  placements: [ItemPlacementSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RoomLayout', RoomLayoutSchema);