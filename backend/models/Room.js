
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  block: { type: String, required: true },
  floor: { type: Number, required: true },
});

module.exports = mongoose.model('Room', roomSchema);
