
const express = require('express');
const router = express.Router();
const Query = require('../models/Query');

// Get all queries
router.get('/', async (req, res) => {
  try {
    const queries = await Query.find().populate('studentId', 'name');
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new query
router.post('/', async (req, res) => {
  try {
    const query = new Query(req.body);
    const newQuery = await query.save();
    res.status(201).json(newQuery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add reply to query
router.post('/:id/replies', async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    query.replies.push(req.body);
    query.status = 'in-progress';
    query.updatedAt = Date.now();
    const updatedQuery = await query.save();
    res.json(updatedQuery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
