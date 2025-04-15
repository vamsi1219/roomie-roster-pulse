
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    const roomsWithOccupants = await Promise.all(
      rooms.map(async (room) => {
        const occupants = await User.find({ 
          role: 'student',
          roomId: room._id 
        });
        return {
          ...room.toObject(),
          occupants
        };
      })
    );
    res.json(roomsWithOccupants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
