const express = require('express');
const router = express.Router();
const MiningRig = require('../models/MiningRig');

// Test database connection
router.get('/test', async (req, res) => {
  try {
    await MiningRig.findOne(); // Attempt to find one rig
    res.status(200).json({ message: 'Database connection is working!' });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Get all rigs for an owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const rigs = await MiningRig.find({ owner: req.params.ownerId });
    res.json(rigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Other existing routes...

module.exports = router;