const mongoose = require('mongoose');

const MiningRigSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'paused'],
    default: 'offline'
  },
  connectionDetails: {
    ip: String,
    port: Number,
    protocol: {
      type: String,
      enum: ['stratum2'],
      default: 'stratum2'
    }
  },
  hardware: {
    gpus: [{
      model: String,
      temperature: Number,
      fanSpeed: Number,
      hashrate: Number,
      power: Number,
      memory: Number,
      core: Number
    }],
    totalHashrate: {
      type: Number,
      default: 0
    },
    totalPower: {
      type: Number,
      default: 0
    }
  },
  performance: {
    efficiency: Number,
    dailyEarnings: Number,
    uptime: Number
  },
  settings: {
    autoOptimize: {
      type: Boolean,
      default: true
    },
    powerLimit: {
      type: Number,
      default: 100
    },
    targetTemperature: {
      type: Number,
      default: 70
    }
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  alerts: [{
    type: {
      type: String,
      enum: ['temperature', 'performance', 'connection', 'system']
    },
    message: String,
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Pre-save middleware to update totalHashrate and totalPower
MiningRigSchema.pre('save', function(next) {
  if (this.hardware && this.hardware.gpus && this.hardware.gpus.length > 0) {
    this.hardware.totalHashrate = this.hardware.gpus.reduce((sum, gpu) => sum + (gpu.hashrate || 0), 0);
    this.hardware.totalPower = this.hardware.gpus.reduce((sum, gpu) => sum + (gpu.power || 0), 0);
    
    // Calculate efficiency (hashrate per watt)
    if (this.hardware.totalPower > 0) {
      this.performance = {
        ...this.performance,
        efficiency: this.hardware.totalHashrate / this.hardware.totalPower
      };
    }
  }
  next();
});

// Method to update rig status
MiningRigSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  this.lastSeen = Date.now();
  return this.save();
};

// Method to add alert
MiningRigSchema.methods.addAlert = function(type, message, severity = 'info') {
  this.alerts.push({
    type,
    message,
    severity,
    timestamp: Date.now()
  });
  return this.save();
};

// Static method to find active rigs
MiningRigSchema.statics.findActive = function() {
  return this.find({ status: { $ne: 'offline' } });
};

module.exports = mongoose.model('MiningRig', MiningRigSchema);