const mongoose = require('mongoose');

const miningRigSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    // This will store the wallet address of the rig owner
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'mining', 'error'],
    default: 'offline',
  },
  hardware: {
    gpus: [{
      model: String,
      temperature: Number,
      fanSpeed: Number,
      hashrate: Number,
      power: Number,
      memory: Number,
      core: Number,
    }],
    totalHashrate: Number,
    totalPower: Number,
  },
  settings: {
    autoOptimize: {
      type: Boolean,
      default: true,
    },
    powerLimit: {
      type: Number,
      default: 100, // percentage
    },
    targetTemperature: {
      type: Number,
      default: 70, // celsius
    },
  },
  performance: {
    dailyEarnings: Number,
    weeklyEarnings: Number,
    monthlyEarnings: Number,
    efficiency: Number, // hashrate per watt
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  connectionDetails: {
    ip: String,
    port: Number,
    protocol: {
      type: String,
      enum: ['stratum', 'stratum2', 'http'],
      default: 'stratum2',
    },
  },
  alerts: [{
    type: {
      type: String,
      enum: ['temperature', 'hashrate', 'power', 'connection', 'error'],
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
});

// Index for quick lookups by owner
miningRigSchema.index({ owner: 1 });

// Method to update rig status and last seen
miningRigSchema.methods.updateStatus = async function(status) {
  this.status = status;
  this.lastSeen = Date.now();
  await this.save();
};

// Method to add an alert
miningRigSchema.methods.addAlert = async function(type, message) {
  this.alerts.push({ type, message });
  await this.save();
};

// Method to update hardware metrics
miningRigSchema.methods.updateMetrics = async function(metrics) {
  this.hardware = {
    ...this.hardware,
    ...metrics,
  };
  this.lastSeen = Date.now();
  await this.save();
};

// Static method to find inactive rigs
miningRigSchema.statics.findInactive = function(threshold = 5) {
  const cutoff = new Date(Date.now() - threshold * 60 * 1000); // threshold in minutes
  return this.find({
    lastSeen: { $lt: cutoff },
    status: { $ne: 'offline' },
  });
};

const MiningRig = mongoose.model('MiningRig', miningRigSchema);

module.exports = MiningRig;