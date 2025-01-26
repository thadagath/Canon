const mongoose = require('mongoose');

const RigRegistrationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  connectionDetails: {
    ip: {
      type: String,
      required: true
    },
    port: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'paused'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RigRegistration', RigRegistrationSchema);