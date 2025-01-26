const express = require('express');
const router = express.Router();
const RigRegistration = require('../models/RigRegistration');
const RigDetails = require('../models/RigDetails');
const authController = require('../controllers/authController');

// Protect routes with authentication middleware
router.use(authController.verifyToken);

// Register a new rig
router.post('/register', async (req, res) => {
  const { name, connectionDetails } = req.body;
  console.log('Received payload:', req.body); // Log the received payload for debugging

  try {
    const newRigRegistration = new RigRegistration({
      owner: req.user.userId,
      name,
      connectionDetails,
      status: 'paused', // Default status
      lastSeen: Date.now()
    });
    await newRigRegistration.save();

    const newRigDetails = new RigDetails({
      rig: newRigRegistration._id,
      name,
      status: 'paused',
      hardware: {
        gpus: [],
        totalHashrate: 0,
        totalPower: 0
      },
      settings: {
        autoOptimize: true,
        powerLimit: 100,
        targetTemperature: 70
      },
      profitability: {
        btcPerDay: 0,
        usdPrice: 0
      }
    });
    await newRigDetails.save();

    res.status(201).json(newRigRegistration);
  } catch (error) {
    console.error('Error registering rig:', error);
    res.status(500).json({ message: 'Rig registration failed' });
  }
});

// Activate a rig
router.post('/:rigId/activate', async (req, res) => {
  try {
    const { rigId } = req.params;
    const rig = await RigRegistration.findById(rigId);
    if (!rig) {
      return res.status(404).json({ message: 'Rig not found' });
    }

    // Update the rig status to 'online'
    rig.status = 'online';
    rig.lastSeen = Date.now();
    await rig.save();

    res.status(200).json({ message: 'Rig activated successfully' });
  } catch (error) {
    console.error('Error activating rig:', error);
    res.status(500).json({ message: 'Failed to activate rig' });
  }
});

// Remove a rig
router.delete('/:rigId', async (req, res) => {
  try {
    const { rigId } = req.params;
    const rig = await RigRegistration.findById(rigId);
    if (!rig) {
      return res.status(404).json({ message: 'Rig not found' });
    }

    // Remove the rig from both collections
    await RigRegistration.findByIdAndDelete(rigId);
    await RigDetails.findOneAndDelete({ rig: rigId });

    res.status(200).json({ message: 'Rig removed successfully' });
  } catch (error) {
    console.error('Error removing rig:', error);
    res.status(500).json({ message: 'Failed to remove rig' });
  }
});

// Get all rigs for the logged-in user
router.get('/', async (req, res) => {
  try {
    const rigs = await RigRegistration.find({ owner: req.user.userId });
    const rigDetails = await RigDetails.find({ rig: { $in: rigs.map(rig => rig._id) } });

    const rigsWithDetails = rigs.map(rig => {
      const details = rigDetails.find(detail => detail.rig.toString() === rig._id.toString());
      return { ...rig.toObject(), details };
    });

    res.json(rigsWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;