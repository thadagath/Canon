const express = require('express');
const MiningRig = require('../models/MiningRig');
const router = express.Router();

// Get all rigs for an owner
router.get('/owner/:address', async (req, res) => {
  try {
    const rigs = await MiningRig.find({ owner: req.params.address });
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
      return res.status(404).json({ message: 'Rig not found' });
    }
    res.json(rig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update rig settings
router.patch('/:id/settings', async (req, res) => {
  try {
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Rig not found' });
    }

    // Update only allowed settings
    const allowedSettings = ['autoOptimize', 'powerLimit', 'targetTemperature'];
    allowedSettings.forEach(setting => {
      if (req.body[setting] !== undefined) {
        rig.settings[setting] = req.body[setting];
      }
    });

    await rig.save();
    res.json(rig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rig performance history
router.get('/:id/performance', async (req, res) => {
  try {
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Rig not found' });
    }
    res.json(rig.performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rig alerts
router.get('/:id/alerts', async (req, res) => {
  try {
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Rig not found' });
    }
    res.json(rig.alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark alert as resolved
router.patch('/:id/alerts/:alertId', async (req, res) => {
  try {
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Rig not found' });
    }

    const alert = rig.alerts.id(req.params.alertId);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.resolved = true;
    await rig.save();
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rig statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const rig = await MiningRig.findById(req.params.id);
    if (!rig) {
      return res.status(404).json({ message: 'Rig not found' });
    }

    const stats = {
      totalHashrate: rig.hardware.totalHashrate,
      totalPower: rig.hardware.totalPower,
      efficiency: rig.performance.efficiency,
      gpuCount: rig.hardware.gpus.length,
      status: rig.status,
      lastSeen: rig.lastSeen,
      dailyEarnings: rig.performance.dailyEarnings,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;