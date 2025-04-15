
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'warden', 'admin'], required: true },
  profileImage: String,
});

module.exports = mongoose.model('User', userSchema);
