const mongoose = require('mongoose');

const RigDetailsSchema = new mongoose.Schema({
  rig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RigRegistration',
    required: true
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
  hardware: {
    gpus: [
      {
        model: String,
        hashrate: Number,
        power: Number,
        temperature: Number,
        fanSpeed: Number
      }
    ],
    totalHashrate: Number,
    totalPower: Number
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
  profitability: {
    btcPerDay: Number,
    usdPrice: Number
  }
});

module.exports = mongoose.model('RigDetails', RigDetailsSchema);