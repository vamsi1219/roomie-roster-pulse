
const express = require('express');
const router = express.Router();
const Query = require('../models/Query');

// Get all queries
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    const queries = await Query.find(query).populate('studentId', 'name');
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get query by ID
router.get('/:id', async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    
    res.json(query);
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
    
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    
    query.replies.push({
      ...req.body,
      createdAt: new Date()
    });
    
    if (query.status === 'pending') {
      query.status = 'in-progress';
    }
    
    query.updatedAt = new Date();
    const updatedQuery = await query.save();
    res.json(updatedQuery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update query status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const query = await Query.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    
    query.status = status;
    query.updatedAt = new Date();
    const updatedQuery = await query.save();
    res.json(updatedQuery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
