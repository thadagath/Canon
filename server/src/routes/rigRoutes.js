const express = require('express');
const router = express.Router();
const MiningRig = require('../models/MiningRig');

// Get all rigs for an owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const rigs = await MiningRig.find({ owner: req.params.ownerId });
    res.json(rigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific rig details
router.get('/:id', async (req, res) => {
  try {
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Mining rig not found' });
    }
    res.json(rig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register a new rig
router.post('/register', async (req, res) => {
  try {
    const { owner, name, connectionDetails } = req.body;
    const rig = new MiningRig({
      owner,
      name,
      connectionDetails,
      status: 'offline',
      hardware: {
        gpus: [],
        totalHashrate: 0,
        totalPower: 0
      }
    });
    await rig.save();
    res.status(201).json(rig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update rig status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Mining rig not found' });
    }
    await rig.updateStatus(status);
    res.json(rig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update rig settings
router.patch('/:id/settings', async (req, res) => {
  try {
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Mining rig not found' });
    }

    const allowedSettings = ['autoOptimize', 'powerLimit', 'targetTemperature'];
    allowedSettings.forEach(setting => {
      if (req.body[setting] !== undefined) {
        rig.settings[setting] = req.body[setting];
      }
    });

    if (req.body.status) {
      rig.status = req.body.status;
    }

    await rig.save();
    res.json(rig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update hardware metrics
router.patch('/:id/hardware', async (req, res) => {
  try {
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Mining rig not found' });
    }

    const { gpus } = req.body;
    if (gpus && Array.isArray(gpus)) {
      rig.hardware.gpus = gpus;
      rig.lastSeen = Date.now();
      await rig.save();
    }

    res.json(rig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove a rig
router.delete('/:id', async (req, res) => {
  try {
    const rig = await MiningRig.findByIdAndDelete(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Mining rig not found' });
    }
    res.json({ message: 'Mining rig removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rig alerts
router.get('/:id/alerts', async (req, res) => {
  try {
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Mining rig not found' });
    }
    res.json(rig.alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add alert to rig
router.post('/:id/alerts', async (req, res) => {
  try {
    const { type, message, severity } = req.body;
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Mining rig not found' });
    }
    await rig.addAlert(type, message, severity);
    res.json(rig.alerts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get active rigs
router.get('/status/active', async (req, res) => {
  try {
    const activeRigs = await MiningRig.findActive();
    res.json(activeRigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;